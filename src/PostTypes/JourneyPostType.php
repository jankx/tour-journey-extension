<?php
namespace Jankx\Extensions\TourJourney\PostTypes;

class JourneyPostType
{
    const POST_TYPE = 'tour_journey';

    public function register(): void
    {
        add_action('init', [$this, 'registerPostType'], 15);
    }

    public function registerPostType(): void
    {
        $labels = [
            'name' => __('Hành trình', 'jankx'),
            'singular_name' => __('Hành trình', 'jankx'),
            'menu_name' => __('Hành trình', 'jankx'),
            'name_admin_bar' => __('Hành trình', 'jankx'),
            'add_new' => __('Thêm mới', 'jankx'),
            'add_new_item' => __('Thêm Hành trình mới', 'jankx'),
            'new_item' => __('Hành trình mới', 'jankx'),
            'edit_item' => __('Sửa Hành trình', 'jankx'),
            'view_item' => __('Xem Hành trình', 'jankx'),
            'all_items' => __('Tất cả Hành trình', 'jankx'),
            'search_items' => __('Tìm Hành trình', 'jankx'),
            'not_found' => __('Không tìm thấy hành trình nào.', 'jankx'),
        ];

        $args = [
            'labels' => $labels,
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'query_var' => true,
            'rewrite' => ['slug' => 'journey'],
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 21,
            'menu_icon' => 'dashicons-location',
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'show_in_rest' => false,
        ];

        register_post_type(self::POST_TYPE, $args);

        // Register the destination taxonomy to this post type if it is registered by travel extension
        if (taxonomy_exists('destination')) {
            register_taxonomy_for_object_type('destination', self::POST_TYPE);
        }
    }
}
