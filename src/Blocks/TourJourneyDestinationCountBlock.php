<?php
namespace Jankx\Extensions\TourJourney\Blocks;

/**
 * "Số điểm đến (Journey)" block.
 *
 * Counts the number of unique "destination" taxonomy terms that are assigned
 * to the current journey post, so visitors know how many places will be
 * visited on the tour. Because the count must reflect the live post-terms
 * relationship, this is a server-rendered (dynamic) block — the editor only
 * shows a placeholder.
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
            $terms = wp_get_object_terms($postId, 'destination', ['fields' => 'ids']);
            if (!is_wp_error($terms)) {
                $count = count(array_unique(array_map('intval', $terms)));
            }
        }

        $wrapper_attributes = get_block_wrapper_attributes(['class' => 'tj-destination-count']);

        $icon = sprintf(
            '<span class="tj-destination-count__icon" aria-hidden="true">%s</span>',
            esc_html('📍')
        );

        $html = '<div %s>%s<span class="tj-destination-count__value">%d</span><span class="tj-destination-count__label">%s</span></div>';

        return sprintf(
            $html,
            $wrapper_attributes,
            $icon,
            $count,
            esc_html__('điểm đến sẽ tham quan', 'jankx')
        );
    }
}
