import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

registerBlockType('jankx/tour-journey-destination-count', {
    edit: () => {
        const blockProps = useBlockProps({ className: 'tj-destination-count' });
        return (
            <div {...blockProps}>
                <span className="tj-destination-count__icon" aria-hidden="true">{'\uD83D\uDCCD'}</span>
                <span className="tj-destination-count__value">{'\u2013'}</span>
                <span className="tj-destination-count__label">
                    {__('Số điểm đến sẽ tham quan (hiển thị ở giao diện)', 'jankx')}
                </span>
            </div>
        );
    },
    save: () => null,
});
