import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('jankx/tour-journey-time', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({ className: 'tj-time' });
        return (
            <RichText
                {...blockProps}
                tagName="div"
                className="tj-time"
                value={attributes.content}
                onChange={(content) => setAttributes({ content })}
                placeholder={__('Ngày / Thời gian…', 'jankx')}
            />
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({ className: 'tj-time' });
        return <RichText.Content {...blockProps} tagName="div" value={attributes.content} />;
    },
});
