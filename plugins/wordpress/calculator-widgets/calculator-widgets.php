<?php
/**
 * Plugin Name: Calculator Widgets
 * Plugin URI: https://yourcalculatorsite.com/wordpress-plugin
 * Description: Embed powerful calculators in your WordPress site with ease.
 * Version: 2.0.0
 * Author: Your Calculator Platform
 * License: GPL v2 or later
 * Text Domain: calculator-widgets
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('CALC_WIDGETS_VERSION', '2.0.0');
define('CALC_WIDGETS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CALC_WIDGETS_PLUGIN_PATH', plugin_dir_path(__FILE__));

// Main plugin class
class CalculatorWidgets {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        // Load text domain for translations
        load_plugin_textdomain('calculator-widgets', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Add shortcode
        add_shortcode('calculator', array($this, 'calculator_shortcode'));
        
        // Add Gutenberg block
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        
        // Add admin menu
        if (is_admin()) {
            add_action('admin_menu', array($this, 'add_admin_menu'));
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        }
        
        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
    }
    
    public function calculator_shortcode($atts) {
        $atts = shortcode_atts(array(
            'id' => '',
            'theme' => 'light',
            'size' => 'medium',
            'branding' => 'true',
            'custom_css' => ''
        ), $atts, 'calculator');
        
        if (empty($atts['id'])) {
            return '<p>Error: Calculator ID is required.</p>';
        }
        
        $widget_id = 'calc-widget-' . uniqid();
        
        $output = sprintf(
            '<div id="%s" class="calculator-widget-container" data-calculator-id="%s" data-theme="%s" data-size="%s" data-branding="%s"></div>',
            esc_attr($widget_id),
            esc_attr($atts['id']),
            esc_attr($atts['theme']),
            esc_attr($atts['size']),
            esc_attr($atts['branding'])
        );
        
        // Add custom CSS if provided
        if (!empty($atts['custom_css'])) {
            $output .= sprintf('<style>%s</style>', esc_html($atts['custom_css']));
        }
        
        // Initialize widget
        $output .= sprintf(
            '<script>
                document.addEventListener("DOMContentLoaded", function() {
                    if (typeof CalculatorWidget !== "undefined") {
                        new CalculatorWidget("%s", %s);
                    }
                });
            </script>',
            esc_js($widget_id),
            json_encode(array(
                'calculatorId' => $atts['id'],
                'theme' => $atts['theme'],
                'size' => $atts['size'],
                'branding' => $atts['branding'] === 'true'
            ))
        );
        
        return $output;
    }
    
    public function enqueue_frontend_scripts() {
        // Only load on pages/posts that contain calculator shortcode
        global $post;
        if (has_shortcode($post->post_content ?? '', 'calculator')) {
            wp_enqueue_script(
                'calculator-widget',
                'https://yourcalculatorsite.com/embed/widget.js',
                array(),
                CALC_WIDGETS_VERSION,
                true
            );
            
            wp_enqueue_style(
                'calculator-widget',
                'https://yourcalculatorsite.com/embed/widget.css',
                array(),
                CALC_WIDGETS_VERSION
            );
        }
    }
    
    public function enqueue_block_editor_assets() {
        wp_enqueue_script(
            'calculator-widgets-block',
            CALC_WIDGETS_PLUGIN_URL . 'assets/block.js',
            array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-components'),
            CALC_WIDGETS_VERSION,
            true
        );
        
        wp_enqueue_style(
            'calculator-widgets-block',
            CALC_WIDGETS_PLUGIN_URL . 'assets/block.css',
            array(),
            CALC_WIDGETS_VERSION
        );
    }
    
    public function add_admin_menu() {
        add_options_page(
            __('Calculator Widgets', 'calculator-widgets'),
            __('Calculator Widgets', 'calculator-widgets'),
            'manage_options',
            'calculator-widgets',
            array($this, 'admin_page')
        );
    }
    
    public function admin_page() {
        include CALC_WIDGETS_PLUGIN_PATH . 'admin/settings.php';
    }
    
    public function enqueue_admin_scripts($hook) {
        if ($hook === 'settings_page_calculator-widgets') {
            wp_enqueue_script(
                'calculator-widgets-admin',
                CALC_WIDGETS_PLUGIN_URL . 'assets/admin.js',
                array('jquery'),
                CALC_WIDGETS_VERSION,
                true
            );
            
            wp_enqueue_style(
                'calculator-widgets-admin',
                CALC_WIDGETS_PLUGIN_URL . 'assets/admin.css',
                array(),
                CALC_WIDGETS_VERSION
            );
        }
    }
    
    public function activate() {
        // Set default options
        if (!get_option('calc_widgets_api_key')) {
            add_option('calc_widgets_api_key', '');
        }
        if (!get_option('calc_widgets_default_theme')) {
            add_option('calc_widgets_default_theme', 'light');
        }
    }
    
    public function deactivate() {
        // Cleanup if needed
    }
}

// Initialize the plugin
new CalculatorWidgets();

// Gutenberg block registration
function calculator_widgets_register_block() {
    register_block_type('calculator-widgets/calculator', array(
        'editor_script' => 'calculator-widgets-block',
        'render_callback' => 'calculator_widgets_render_block',
        'attributes' => array(
            'calculatorId' => array(
                'type' => 'string',
                'default' => ''
            ),
            'theme' => array(
                'type' => 'string',
                'default' => 'light'
            ),
            'size' => array(
                'type' => 'string',
                'default' => 'medium'
            ),
            'branding' => array(
                'type' => 'boolean',
                'default' => true
            )
        )
    ));
}
add_action('init', 'calculator_widgets_register_block');

function calculator_widgets_render_block($attributes) {
    $shortcode_atts = array(
        'id' => $attributes['calculatorId'] ?? '',
        'theme' => $attributes['theme'] ?? 'light',
        'size' => $attributes['size'] ?? 'medium',
        'branding' => ($attributes['branding'] ?? true) ? 'true' : 'false'
    );
    
    $calculator_widgets = new CalculatorWidgets();
    return $calculator_widgets->calculator_shortcode($shortcode_atts);
}
?>
