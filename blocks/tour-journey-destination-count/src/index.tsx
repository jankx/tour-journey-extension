import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';

registerBlockType('jankx/tour-journey-destination-count', {
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({ className: 'tj-destination-count' });

        const postId = useSelect((select) => select('core/editor')?.getCurrentPostId?.() || 0, []);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Cài đặt hiển thị', 'jankx')} initialOpen={true}>
                        <TextControl
                            label={__('Biểu tượng', 'jankx')}
                            value={attributes.icon}
                            onChange={(icon) => setAttributes({ icon })}
                            help={__('Nhập emoji hoặc ký tự làm biểu tượng.', 'jankx')}
                        />
                        <ToggleControl
                            label={__('Hiện biểu tượng', 'jankx')}
                            checked={!!attributes.showIcon}
                            onChange={(showIcon) => setAttributes({ showIcon })}
                        />
                        <TextControl
                            label={__('Nhãn', 'jankx')}
                            value={attributes.label}
                            onChange={(label) => setAttributes({ label })}
                        />
                        <ToggleControl
                            label={__('Hiện nhãn', 'jankx')}
                            checked={!!attributes.showLabel}
                            onChange={(showLabel) => setAttributes({ showLabel })}
                        />
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    <ServerSideRender
                        block="jankx/tour-journey-destination-count"
                        attributes={attributes}
                        urlQueryArgs={postId ? { post_id: postId } : {}}
                    />
                </div>
            </>
        );
    },
    save: () => null,
});
