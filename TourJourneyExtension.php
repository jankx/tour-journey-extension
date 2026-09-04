<?php
namespace Jankx\Extensions\TourJourney;

use Jankx\Extensions\AbstractExtension;
use Jankx\Extensions\TourJourney\PostTypes\JourneyPostType;
use Jankx\Extensions\TourJourney\Admin\JourneyBuilderMetabox;

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

        if (is_admin()) {
            $metabox = new JourneyBuilderMetabox();
            $metabox->register();
        }
    }
}
