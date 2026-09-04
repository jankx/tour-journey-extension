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

        // Sync with Classic Editor Taxonomy Panel
        function syncWithClassicTaxonomies() {
            // Danh sách checkbox của taxonomy destination
            const $destinationCheckboxes = $('#destinationdiv input[type="checkbox"]');

            if (!$destinationCheckboxes.length) return;

            function updateFromCheckboxes() {
                let newSelectedIds = [];
                let termsMap = {};

                $destinationCheckboxes.each(function () {
                    if ($(this).is(':checked')) {
                        const val = parseInt($(this).val());
                        if (val > 0) {
                            newSelectedIds.push(val);
                            termsMap[val] = $(this).parent().text().trim();
                        }
                    }
                });

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
                    reconcileItemsClassic(termsMap);
                }
            }

            // Gắn event listener
            $destinationCheckboxes.on('change', function () {
                updateFromCheckboxes();
            });

            // Khởi chạy lần đầu tiên
            updateFromCheckboxes();
        }

        function reconcileItemsClassic(termsMap) {
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

            // Re-render
            renderBuilder();
        }

        // Khởi động
        setTimeout(function () {
            if ($('#destinationdiv').length) {
                syncWithClassicTaxonomies();
            } else {
                renderBuilder();
            }
        }, 500);
    });
})(jQuery);
