import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';

registerBlockType('jankx/tour-journey-destination-count', {
    edit: () => {
        const blockProps = useBlockProps({ className: 'tj-destination-count' });

        const postId = useSelect((select) => select('core/editor')?.getCurrentPostId?.() || 0, []);

        return (
            <div {...blockProps}>
                <ServerSideRender
                    block="jankx/tour-journey-destination-count"
                    urlQueryArgs={postId ? { post_id: postId } : {}}
                />
            </div>
        );
    },
    save: () => null,
});