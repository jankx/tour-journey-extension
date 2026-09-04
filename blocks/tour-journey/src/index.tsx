import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Placeholder, Spinner, Notice } from '@wordpress/components';

const ALLOWED = [
    'jankx/tour-journey-destination',
    'jankx/tour-journey-time',
    'jankx/tour-journey-details',
];

const ITINERARY_META = '_jankx_journey_itinerary';

const buildTemplate = (itinerary) => {
    if (!Array.isArray(itinerary) || itinerary.length === 0) {
        return [
            ['jankx/tour-journey-time', { content: __('Ngày 1', 'jankx') }],
            ['jankx/tour-journey-destination', { content: __('Điểm đến', 'jankx') }],
            ['jankx/tour-journey-details', { content: __('Mô tả chi tiết chặng này…', 'jankx') }],
        ];
    }

    return itinerary.map((stop) => [
        'core/group',
        { className: 'tj-stop' },
        [
            ['jankx/tour-journey-time', { content: stop.time_label || '' }],
            ['jankx/tour-journey-destination', { content: stop.name || '' }],
            ['jankx/tour-journey-details', { content: stop.description || '' }],
        ],
    ]);
};

const Edit = () => {
    const { itinerary, hasMeta } = useSelect((select) => {
        const edited = select('core/editor').getEditedPostAttribute('meta');
        return {
            itinerary: edited && edited[ITINERARY_META] ? edited[ITINERARY_META] : null,
            hasMeta: !!edited && ITINERARY_META in edited,
        };
    }, []);

    const blockProps = useBlockProps({ className: 'tj-timeline tj-timeline--editor' });
    const innerBlocksProps = useInnerBlocksProps(
        { ...blockProps },
        {
            allowedBlocks: ALLOWED,
            template: itinerary ? buildTemplate(itinerary) : undefined,
            templateLock: false,
            orientation: 'vertical',
            renderAppender: false,
        }
    );

    if (!hasMeta) {
        return (
            <div {...blockProps}>
                <Placeholder icon="timeline" label={__('Tour Journey', 'jankx')}>
                    <Notice status="warning" isDismissible={false}>
                        {__('Không tìm thấy dữ liệu hành trình. Hãy lưu điểm đến &amp; itinerary ở mục “Itinerary Builder” trước.', 'jankx')}
                    </Notice>
                </Placeholder>
            </div>
        );
    }

    if (itinerary === null) {
        return (
            <div {...blockProps}>
                <Placeholder icon="timeline" label={__('Tour Journey', 'jankx')}>
                    <Spinner />
                </Placeholder>
            </div>
        );
    }

    return <div {...innerBlocksProps} />;
};

const Save = () => {
    return useInnerBlocksProps.save();
};

registerBlockType('jankx/tour-journey', {
    edit: Edit,
    save: Save,
});
