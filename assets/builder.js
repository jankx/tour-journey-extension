(function ($) {
    $(document).ready(function () {
        if (!$('#jankx-journey-builder-app').length) return;

        const $list = $('#journey-builder-list');
        const $dataInput = $('#jankx-journey-data');

        // Initial data
        let itineraryItems = window.jankxSavedJourneyItinerary || [];

        // Current selected term IDs to sync
        let currentSelectedTermIds = [];

        function renderBuilder() {
            $list.empty();
            if (itineraryItems.length === 0) {
                $list.append('<p class="no-items">Chưa có điểm đến nào. Hãy chọn điểm đến ở mục "Điểm đến" bên phải.</p>');
                updateDataField();
                return;
            }

            itineraryItems.forEach((item, index) => {
                const isOrphaned = !currentSelectedTermIds.includes(parseInt(item.term_id)) && item.term_id > 0;

                const $el = $(`
                    <div class="journey-item ${isOrphaned ? 'is-orphaned' : ''}" data-index="${index}" data-term-id="${item.term_id}">
                        <div class="journey-item-header">
                            <span class="journey-item-handle dashicons dashicons-menu"></span>
                            <h4 class="journey-item-title">${item.name || 'Điểm đến vô danh'}</h4>
                            ${isOrphaned ? '<span style="color:red; margin-left: 10px; font-size:12px;">(Chưa chọn trong taxonomy)</span>' : ''}
                        </div>
                        <div class="journey-item-body">
                            <div class="journey-field">
                                <label>Mốc thời gian (VD: Ngày 1, Đêm 1)</label>
                                <input type="text" class="j-input-time" value="${item.time_label || ''}" placeholder="Nhập mốc thời gian..." />
                            </div>
                            <div class="journey-field">
                                <label>Thông tin chi tiết (Mô tả các hoạt động)</label>
                                <textarea class="j-input-desc" rows="3" placeholder="Ghi chú chi tiết cho mốc thời gian này...">${item.description || ''}</textarea>
                            </div>
                        </div>
                    </div>
                `);

                $list.append($el);
            });

            // Initialize Sortable
            $list.sortable({
                handle: '.journey-item-handle',
                axis: 'y',
                update: function (event, ui) {
                    reorderItems();
                }
            });

            updateDataField();
        }

        function reorderItems() {
            const newItems = [];
            $list.find('.journey-item').each(function () {
                const termId = $(this).data('term-id');
                const name = $(this).find('.journey-item-title').text().replace('(Chưa chọn trong taxonomy)', '').trim();
                const timeStr = $(this).find('.j-input-time').val();
                const descStr = $(this).find('.j-input-desc').val();
                newItems.push({
                    term_id: termId,
                    name: name,
                    time_label: timeStr,
                    description: descStr
                });
            });
            itineraryItems = newItems;
            updateDataField();
        }

        function updateDataField() {
            $dataInput.val(JSON.stringify(itineraryItems));
        }

        // Setup event delegation for inputs changing
        $list.on('input', '.j-input-time, .j-input-desc', function () {
            reorderItems(); // Re-read DOM values and save to state
        });

        // Sync with Gutenberg Taxonomy Panel
        function syncWithTaxonomies() {
            if (!wp || !wp.data) return;

            // Subscribe to Gutenberg store changes
            wp.data.subscribe(function () {
                const isSavingPost = wp.data.select('core/editor').isSavingPost();
                const isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();

                if (isSavingPost || isAutosavingPost) return; // Don't disrupt during saving

                // Get selected destinations
                // destination might be registered as an array of IDs in post meta or core terms
                const editedPost = wp.data.select('core/editor').getEditedPostAttribute('destination');

                if (editedPost === undefined) return; // destination taxonomy might not be loaded yet

                let newSelectedIds = Array.isArray(editedPost) ? editedPost : [];

                // Compare with current
                let hasChanged = false;
                if (newSelectedIds.length !== currentSelectedTermIds.length) {
                    hasChanged = true;
                } else {
                    for (let i = 0; i < newSelectedIds.length; i++) {
                        if (!currentSelectedTermIds.includes(newSelectedIds[i])) {
                            hasChanged = true;
                            break;
                        }
                    }
                }

                if (hasChanged) {
                    currentSelectedTermIds = [...newSelectedIds];

                    // Fetch term names
                    if (currentSelectedTermIds.length > 0) {
                        wp.apiFetch({ path: '/wp/v2/destination?include=' + currentSelectedTermIds.join(',') })
                            .then(function (terms) {
                                reconcileItems(terms);
                            });
                    } else {
                        reconcileItems([]);
                    }
                }
            });
        }

        function reconcileItems(terms) {
            let termsMap = {};
            terms.forEach(t => termsMap[t.id] = t.name);

            // 1. Add new terms that don't exist in itinerary
            currentSelectedTermIds.forEach(id => {
                const exists = itineraryItems.find(item => parseInt(item.term_id) === parseInt(id));
                if (!exists && termsMap[id]) {
                    itineraryItems.push({
                        term_id: id,
                        name: termsMap[id],
                        time_label: '',
                        description: ''
                    });
                }
            });

            // 2. We do NOT auto-remove items. If user deselects, they will be marked as "is-orphaned".
            // That allows users to manually fix it if they accidentally unchecked. 
            // Or we just re-render to update the "is-orphaned" visual state.

            // Re-render
            renderBuilder();
        }

        // Wait a bit for Gutenberg data to be ready
        setTimeout(function () {
            syncWithTaxonomies();

            // Initial render
            // Try to extract initial terms from WP Data to set currentSelectedTermIds initially
            if (wp && wp.data) {
                const initialTerms = wp.data.select('core/editor').getEditedPostAttribute('destination');
                if (Array.isArray(initialTerms)) {
                    currentSelectedTermIds = [...initialTerms];
                }
            }
            renderBuilder();
        }, 1000);
    });
})(jQuery);
