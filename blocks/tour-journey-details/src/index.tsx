import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('jankx/tour-journey-details', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({ className: 'tj-details' });
        return (
            <RichText
                {...blockProps}
                tagName="div"
                multiline="p"
                className="tj-details"
                value={attributes.content}
                onChange={(content) => setAttributes({ content })}
                placeholder={__('Thông tin chi tiết chặng…', 'jankx')}
            />
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({ className: 'tj-details' });
        return <RichText.Content {...blockProps} tagName="div" multiline="p" value={attributes.content} />;
    },
});
