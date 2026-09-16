<?php
namespace Jankx\Extensions\TourJourney\Blocks;

use Jankx\Extensions\TourJourney\Admin\JourneyBuilderMetabox;

/**
 * "Số điểm đến (Journey)" block.
 *
 * Counts the number of stops in the journey's itinerary (the
 * "_jankx_journey_itinerary" post meta managed by the Journey Builder
 * metabox), so visitors know how many places will be visited on the tour.
 *
 * Because the count must reflect the live itinerary, this is a
 * server-rendered (dynamic) block — the editor reuses the server render
 * via ServerSideRender so it matches the frontend.
 */
class TourJourneyDestinationCountBlock extends Block
{
    protected $blockId = 'jankx/tour-journey-destination-count';

    /**
     * Resolve the post id that owns the terms to count.
     *
     * Prefers the context post (e.g. when rendered inside a query/post block),
     * then falls back to the global post / get_the_ID().
     */
    protected function resolvePostId(\WP_Block $block = null): int
    {
        if ($block && isset($block->context['postId'])) {
            return (int) $block->context['postId'];
        }

        if ($block && $block->context && !empty($block->context['postId'])) {
            return (int) $block->context['postId'];
        }

        $postId = get_the_ID();
        if ($postId) {
            return (int) $postId;
        }

        global $post;
        return $post instanceof \WP_Post ? (int) $post->ID : 0;
    }

    public function render(array $attributes, string $content = '', \WP_Block $block = null): string
    {
        $postId = $this->resolvePostId($block);
        $count = 0;

        if ($postId) {
            $itinerary = get_post_meta($postId, JourneyBuilderMetabox::META_KEY, true);
            if (is_array($itinerary)) {
                foreach ($itinerary as $stop) {
                    if (is_array($stop) && !empty($stop['name'])) {
                        $count++;
                    }
                }
            }
        }

        $iconText = isset($attributes['icon']) ? trim((string) $attributes['icon']) : '';
        if ($iconText === '') {
            $iconText = '📍';
        }

        $label = isset($attributes['label']) ? trim((string) $attributes['label']) : '';
        if ($label === '') {
            $label = __('điểm đến sẽ tham quan', 'jankx');
        }

        $showIcon = array_key_exists('showIcon', $attributes) ? (bool) $attributes['showIcon'] : true;
        $showLabel = array_key_exists('showLabel', $attributes) ? (bool) $attributes['showLabel'] : true;

        $wrapper_attributes = get_block_wrapper_attributes(['class' => 'tj-destination-count']);

        $parts = '';

        if ($showIcon) {
            $parts .= sprintf(
                '<span class="tj-destination-count__icon" aria-hidden="true">%s</span>',
                esc_html($iconText)
            );
        }

        $parts .= sprintf('<span class="tj-destination-count__value">%d</span>', $count);

        if ($showLabel) {
            $parts .= sprintf('<span class="tj-destination-count__label">%s</span>', esc_html($label));
        }

        return sprintf('<div %s>%s</div>', $wrapper_attributes, $parts);
    }
}
