<?php
// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Handle form submission
if (isset($_POST['submit'])) {
    check_admin_referer('calc_widgets_settings');
    
    update_option('calc_widgets_api_key', sanitize_text_field($_POST['api_key']));
    update_option('calc_widgets_default_theme', sanitize_text_field($_POST['default_theme']));
    
    echo '<div class="notice notice-success"><p>' . __('Settings saved!', 'calculator-widgets') . '</p></div>';
}

$api_key = get_option('calc_widgets_api_key', '');
$default_theme = get_option('calc_widgets_default_theme', 'light');
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <form method="post" action="">
        <?php wp_nonce_field('calc_widgets_settings'); ?>
        
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="api_key"><?php _e('API Key', 'calculator-widgets'); ?></label>
                </th>
                <td>
                    <input 
                        type="text" 
                        id="api_key" 
                        name="api_key" 
                        value="<?php echo esc_attr($api_key); ?>" 
                        class="regular-text" 
                    />
                    <p class="description">
                        <?php _e('Enter your API key from your calculator platform account.', 'calculator-widgets'); ?>
                        <a href="https://yourcalculatorsite.com/account/api" target="_blank">
                            <?php _e('Get your API key', 'calculator-widgets'); ?>
                        </a>
                    </p>
                </td>
            </tr>
            
            <tr>
                <th scope="row">
                    <label for="default_theme"><?php _e('Default Theme', 'calculator-widgets'); ?></label>
                </th>
                <td>
                    <select id="default_theme" name="default_theme">
                        <option value="light" <?php selected($default_theme, 'light'); ?>>
                            <?php _e('Light', 'calculator-widgets'); ?>
                        </option>
                        <option value="dark" <?php selected($default_theme, 'dark'); ?>>
                            <?php _e('Dark', 'calculator-widgets'); ?>
                        </option>
                    </select>
                </td>
            </tr>
        </table>
        
        <?php submit_button(); ?>
    </form>
    
    <hr>
    
    <h2><?php _e('How to Use', 'calculator-widgets'); ?></h2>
    <p><?php _e('Use the shortcode to embed calculators in your posts and pages:', 'calculator-widgets'); ?></p>
    <code>[calculator id="mortgage" theme="light" size="medium"]</code>
    
    <h3><?php _e('Available Shortcode Parameters:', 'calculator-widgets'); ?></h3>
    <ul>
        <li><strong>id</strong> - <?php _e('Calculator ID (required)', 'calculator-widgets'); ?></li>
        <li><strong>theme</strong> - <?php _e('light, dark, or custom (default: light)', 'calculator-widgets'); ?></li>
        <li><strong>size</strong> - <?php _e('compact, medium, large, fullwidth (default: medium)', 'calculator-widgets'); ?></li>
        <li><strong>branding</strong> - <?php _e('true or false (default: true)', 'calculator-widgets'); ?></li>
    </ul>
    
    <p>
        <a href="https://yourcalculatorsite.com/docs/wordpress" target="_blank" class="button">
            <?php _e('View Documentation', 'calculator-widgets'); ?>
        </a>
    </p>
</div>
