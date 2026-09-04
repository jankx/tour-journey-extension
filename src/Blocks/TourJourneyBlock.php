<?php
namespace Jankx\Extensions\TourJourney\Blocks;

use Jankx\Extensions\TourJourney\Admin\JourneyBuilderMetabox;

/**
 * Main "Tour Journey" block.
 *
 * Renders a vertical timeline containing the inner blocks (each itinerary stop
 * is a cluster of the Destination / Time / Details child blocks). The inner
 * blocks are authored & ordered by the user in the editor and are preserved in
 * the post content; this class only wraps them in the timeline container and
 * always leaves the timeline line/dot markers in place.
 */
class TourJourneyBlock extends Block
{
    protected $blockId = 'jankx/tour-journey';

    public function render(array $attributes, string $content = '', \WP_Block $block = null): string
    {
        if (empty(trim($content))) {
            return '';
        }

        $wrapper_attributes = get_block_wrapper_attributes(['class' => 'tj-timeline']);

        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $content
        );
    }
}
