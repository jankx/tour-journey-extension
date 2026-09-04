import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

registerBlockType('jankx/tour-journey-destination', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({ className: 'tj-destination' });
        return (
            <RichText
                {...blockProps}
                tagName="h3"
                className="tj-destination"
                value={attributes.content}
                onChange={(content) => setAttributes({ content })}
                placeholder={__('Điểm đến…', 'jankx')}
            />
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({ className: 'tj-destination' });
        return <RichText.Content {...blockProps} tagName="h3" value={attributes.content} />;
    },
});
