<?php
namespace Jankx\Extensions\TourJourney;

use Jankx\Extensions\AbstractExtension;
use Jankx\Extensions\TourJourney\PostTypes\JourneyPostType;
use Jankx\Extensions\TourJourney\Admin\JourneyBuilderMetabox;
use Jankx\Extensions\TourJourney\Blocks\TourJourneyBlock;

class TourJourneyExtension extends AbstractExtension
{
    protected static $instance;

    public function __construct()
    {
        $this->register_autoloader();
        parent::__construct();
    }

    protected function register_autoloader()
    {
        spl_autoload_register(function ($class) {
            $prefix = 'Jankx\\Extensions\\TourJourney\\';
            $base_dir = __DIR__ . '/src/';
            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }
            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
            if (file_exists($file)) {
                require $file;
            }
        });
    }

    public function init(): void
    {
        self::$instance = $this;
    }

    public static function get_instance(): ?self
    {
        return self::$instance;
    }

    public function register_hooks(): void
    {
        $journeyPostType = new JourneyPostType();
        $journeyPostType->register();

        // Expose itinerary meta to the editor (REST) so the Tour Journey block
        // can seed its inner block template from the saved journey data.
        add_action('init', [$this, 'registerItineraryMeta']);
        add_action('init', [$this, 'registerBlocks']);

        if (is_admin()) {
            $metabox = new JourneyBuilderMetabox();
            $metabox->register();
        }

        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorAssets']);
    }

    public function registerItineraryMeta(): void
    {
        register_post_meta(JourneyPostType::POST_TYPE, JourneyBuilderMetabox::META_KEY, [
            'type' => 'array',
            'single' => true,
            'show_in_rest' => [
                'schema' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'term_id' => ['type' => 'integer'],
                            'name' => ['type' => 'string'],
                            'time_label' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function registerBlocks(): void
    {
        $blocksDir = $this->get_blocks_path();
        if (!is_dir($blocksDir)) {
            return;
        }

        foreach (glob($blocksDir . '/*', GLOB_ONLYDIR) as $blockDir) {
            if (!file_exists($blockDir . '/block.json')) {
                continue;
            }

            $blockJson = json_decode(file_get_contents($blockDir . '/block.json'), true);
            $blockName = $blockJson['name'] ?? '';

            if ($blockName === 'jankx/tour-journey' && !\WP_Block_Type_Registry::get_instance()->is_registered($blockName)) {
                $block = new TourJourneyBlock($blockDir);
                $block->boot();
                $block->register();
                continue;
            }

            if (!\WP_Block_Type_Registry::get_instance()->is_registered($blockName)) {
                register_block_type_from_metadata($blockDir);
            }
        }
    }

    public function enqueueFrontendAssets(): void
    {
        wp_enqueue_style(
            'jankx-tour-journey-frontend',
            $this->get_extension_url() . '/assets/tour-journey.css',
            [],
            $this->get_version()
        );
    }

    public function enqueueEditorAssets(): void
    {
        $screen = get_current_screen();
        if (!$screen || !in_array($screen->base, ['post', 'page'])) {
            return;
        }

        wp_enqueue_style(
            'jankx-tour-journey-frontend',
            $this->get_extension_url() . '/assets/tour-journey.css',
            [],
            $this->get_version()
        );
    }
}
