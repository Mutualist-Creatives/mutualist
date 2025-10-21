# 🔌 WordPress WPGetAPI Setup Guide

Panduan lengkap untuk mengintegrasikan Mutualist API dengan WordPress menggunakan plugin WPGetAPI.

---

## 📋 Prerequisites

1. WordPress website
2. WPGetAPI plugin installed & activated
3. Mutualist API sudah deployed (Railway/Vercel)

---

## 🚀 Step 1: Install WPGetAPI Plugin

1. Login ke WordPress Admin
2. Go to **Plugins** → **Add New**
3. Search "**WPGetAPI**"
4. Install & Activate plugin
5. Go to **WPGetAPI** → **Setup**

---

## ⚙️ Step 2: Create API Connection

### 2.1 Add New API

1. Go to **WPGetAPI** → **Setup**
2. Click **Add API**
3. Fill in details:

```
API Name: Mutualist Portfolio API
Base URL: https://your-api-domain.railway.app/api
```

4. Click **Save**

---

## 📡 Step 3: Setup Endpoints

### Endpoint 1: Get All Portfolios

**Settings:**

```
Endpoint ID: get-portfolios
Endpoint: /portfolios
Method: GET
Results Format: json_decode
```

**Advanced Settings:**

- Cache Time: 300 (5 minutes)
- Timeout: 30

---

### Endpoint 2: Get Single Portfolio

**Settings:**

```
Endpoint ID: get-portfolio
Endpoint: /portfolios/{{id}}
Method: GET
Results Format: json_decode
```

**Query Parameters:**

- Add parameter: `id` (will be replaced in URL)

**Advanced Settings:**

- Cache Time: 600 (10 minutes)
- Timeout: 30

---

### Endpoint 3: Get Categories

**Settings:**

```
Endpoint ID: get-categories
Endpoint: /portfolios/categories
Method: GET
Results Format: json_decode
```

**Advanced Settings:**

- Cache Time: 3600 (1 hour)
- Timeout: 30

---

## 📝 Step 4: Using in WordPress

### Method 1: Using Shortcode

#### Display All Portfolios

```php
[wpgetapi_endpoint
  api_id="mutualist-portfolio-api"
  endpoint_id="get-portfolios"
]
```

#### Display Single Portfolio

```php
[wpgetapi_endpoint
  api_id="mutualist-portfolio-api"
  endpoint_id="get-portfolio"
  id="550e8400-e29b-41d4-a716-446655440000"
]
```

---

### Method 2: Using PHP in Theme

#### Get All Portfolios

```php
<?php
// In your theme file (e.g., page-portfolio.php)

$portfolios = wpgetapi_endpoint(
    'mutualist-portfolio-api',
    'get-portfolios'
);

if ($portfolios) {
    foreach ($portfolios as $portfolio) {
        ?>
        <div class="portfolio-item">
            <h2><?php echo esc_html($portfolio->title); ?></h2>
            <p><?php echo esc_html($portfolio->description); ?></p>

            <?php if (!empty($portfolio->images)): ?>
                <img src="<?php echo esc_url($portfolio->images[0]); ?>"
                     alt="<?php echo esc_attr($portfolio->title); ?>">
            <?php endif; ?>

            <div class="categories">
                <?php foreach ($portfolio->categories as $category): ?>
                    <span class="badge"><?php echo esc_html($category); ?></span>
                <?php endforeach; ?>
            </div>

            <p class="meta">
                By <?php echo esc_html($portfolio->createdBy); ?>
                | <?php echo esc_html($portfolio->year); ?>
            </p>
        </div>
        <?php
    }
}
?>
```

---

#### Get Single Portfolio

```php
<?php
// Get portfolio ID from URL parameter
$portfolio_id = isset($_GET['id']) ? sanitize_text_field($_GET['id']) : '';

if ($portfolio_id) {
    $portfolio = wpgetapi_endpoint(
        'mutualist-portfolio-api',
        'get-portfolio',
        array('id' => $portfolio_id)
    );

    if ($portfolio) {
        ?>
        <article class="portfolio-single">
            <h1><?php echo esc_html($portfolio->title); ?></h1>

            <!-- Image Gallery -->
            <div class="portfolio-gallery">
                <?php foreach ($portfolio->images as $image): ?>
                    <img src="<?php echo esc_url($image); ?>"
                         alt="<?php echo esc_attr($portfolio->title); ?>">
                <?php endforeach; ?>
            </div>

            <!-- Description -->
            <div class="portfolio-description">
                <?php echo wp_kses_post($portfolio->description); ?>
            </div>

            <!-- Meta Info -->
            <div class="portfolio-meta">
                <p><strong>Created by:</strong> <?php echo esc_html($portfolio->createdBy); ?></p>
                <p><strong>Year:</strong> <?php echo esc_html($portfolio->year); ?></p>
                <p><strong>Categories:</strong>
                    <?php echo esc_html(implode(', ', $portfolio->categories)); ?>
                </p>
            </div>
        </article>
        <?php
    } else {
        echo '<p>Portfolio not found.</p>';
    }
}
?>
```

---

#### Get Categories

```php
<?php
$categories = wpgetapi_endpoint(
    'mutualist-portfolio-api',
    'get-categories'
);

if ($categories) {
    ?>
    <div class="portfolio-filters">
        <button class="filter-btn active" data-category="all">All</button>
        <?php foreach ($categories as $category): ?>
            <button class="filter-btn" data-category="<?php echo esc_attr($category); ?>">
                <?php echo esc_html($category); ?>
            </button>
        <?php endforeach; ?>
    </div>
    <?php
}
?>
```

---

## 🎨 Step 5: Create Portfolio Template

### Create Custom Page Template

**File:** `wp-content/themes/your-theme/page-portfolio.php`

```php
<?php
/**
 * Template Name: Portfolio Gallery
 */

get_header();
?>

<div class="portfolio-page">
    <div class="container">
        <h1>Our Portfolio</h1>

        <!-- Category Filters -->
        <?php
        $categories = wpgetapi_endpoint(
            'mutualist-portfolio-api',
            'get-categories'
        );

        if ($categories) {
            ?>
            <div class="portfolio-filters">
                <button class="filter-btn active" data-category="all">All</button>
                <?php foreach ($categories as $category): ?>
                    <button class="filter-btn" data-category="<?php echo esc_attr($category); ?>">
                        <?php echo esc_html($category); ?>
                    </button>
                <?php endforeach; ?>
            </div>
            <?php
        }
        ?>

        <!-- Portfolio Grid -->
        <div class="portfolio-grid">
            <?php
            $portfolios = wpgetapi_endpoint(
                'mutualist-portfolio-api',
                'get-portfolios'
            );

            if ($portfolios) {
                foreach ($portfolios as $portfolio) {
                    $categories_str = implode(' ', array_map(function($cat) {
                        return 'category-' . sanitize_title($cat);
                    }, $portfolio->categories));
                    ?>
                    <div class="portfolio-item <?php echo esc_attr($categories_str); ?>">
                        <a href="<?php echo add_query_arg('id', $portfolio->id, get_permalink()); ?>">
                            <?php if (!empty($portfolio->images)): ?>
                                <img src="<?php echo esc_url($portfolio->images[0]); ?>"
                                     alt="<?php echo esc_attr($portfolio->title); ?>">
                            <?php endif; ?>

                            <div class="portfolio-overlay">
                                <h3><?php echo esc_html($portfolio->title); ?></h3>
                                <p><?php echo esc_html($portfolio->createdBy); ?></p>
                            </div>
                        </a>
                    </div>
                    <?php
                }
            } else {
                echo '<p>No portfolios found.</p>';
            }
            ?>
        </div>
    </div>
</div>

<style>
.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.portfolio-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    transition: transform 0.3s;
}

.portfolio-item:hover {
    transform: translateY(-5px);
}

.portfolio-item img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}

.portfolio-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white;
    padding: 20px;
    transform: translateY(100%);
    transition: transform 0.3s;
}

.portfolio-item:hover .portfolio-overlay {
    transform: translateY(0);
}

.portfolio-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.filter-btn {
    padding: 10px 20px;
    border: 2px solid #333;
    background: white;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
    background: #333;
    color: white;
}
</style>

<script>
jQuery(document).ready(function($) {
    $('.filter-btn').on('click', function() {
        var category = $(this).data('category');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (category === 'all') {
            $('.portfolio-item').fadeIn();
        } else {
            $('.portfolio-item').hide();
            $('.category-' + category).fadeIn();
        }
    });
});
</script>

<?php
get_footer();
?>
```

---

## 🔄 Step 6: Handle Dynamic Routes

### Option 1: Using Query Parameters

**URL Format:** `https://yoursite.com/portfolio/?id=uuid`

Already shown in examples above.

---

### Option 2: Using Custom Rewrite Rules

**Add to functions.php:**

```php
// Add custom rewrite rule
function mutualist_portfolio_rewrite_rules() {
    add_rewrite_rule(
        '^portfolio/([a-f0-9-]+)/?$',
        'index.php?pagename=portfolio&portfolio_id=$matches[1]',
        'top'
    );
}
add_action('init', 'mutualist_portfolio_rewrite_rules');

// Add query var
function mutualist_portfolio_query_vars($vars) {
    $vars[] = 'portfolio_id';
    return $vars;
}
add_filter('query_vars', 'mutualist_portfolio_query_vars');

// Flush rewrite rules on activation
register_activation_hook(__FILE__, function() {
    mutualist_portfolio_rewrite_rules();
    flush_rewrite_rules();
});
```

**Then in template:**

```php
<?php
$portfolio_id = get_query_var('portfolio_id');

if ($portfolio_id) {
    $portfolio = wpgetapi_endpoint(
        'mutualist-portfolio-api',
        'get-portfolio',
        array('id' => $portfolio_id)
    );
    // Display portfolio...
}
?>
```

**URL Format:** `https://yoursite.com/portfolio/uuid`

---

## 🎯 Step 7: Advanced Features

### Caching Strategy

```php
// Custom cache time per endpoint
function custom_wpgetapi_cache_time($cache_time, $api_id, $endpoint_id) {
    if ($endpoint_id === 'get-portfolios') {
        return 300; // 5 minutes
    }
    if ($endpoint_id === 'get-categories') {
        return 3600; // 1 hour
    }
    return $cache_time;
}
add_filter('wpgetapi_cache_time', 'custom_wpgetapi_cache_time', 10, 3);
```

---

### Error Handling

```php
<?php
$portfolios = wpgetapi_endpoint(
    'mutualist-portfolio-api',
    'get-portfolios'
);

if (is_wp_error($portfolios)) {
    echo '<p>Error loading portfolios: ' . esc_html($portfolios->get_error_message()) . '</p>';
} elseif (empty($portfolios)) {
    echo '<p>No portfolios found.</p>';
} else {
    // Display portfolios...
}
?>
```

---

### Pagination (Client-side)

```php
<?php
$portfolios = wpgetapi_endpoint(
    'mutualist-portfolio-api',
    'get-portfolios'
);

$per_page = 9;
$page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$offset = ($page - 1) * $per_page;

$total = count($portfolios);
$total_pages = ceil($total / $per_page);
$portfolios_paged = array_slice($portfolios, $offset, $per_page);

// Display portfolios_paged...

// Pagination
if ($total_pages > 1) {
    echo '<div class="pagination">';
    for ($i = 1; $i <= $total_pages; $i++) {
        $active = ($i === $page) ? 'active' : '';
        echo '<a href="' . add_query_arg('paged', $i) . '" class="' . $active . '">' . $i . '</a>';
    }
    echo '</div>';
}
?>
```

---

## 🔐 Step 8: Security (Optional)

If your API requires authentication:

### Add API Key Header

1. Go to **WPGetAPI** → **Setup**
2. Select your API
3. Go to **Headers** tab
4. Add header:
   ```
   Key: Authorization
   Value: Bearer YOUR_API_KEY
   ```

---

## 🐛 Troubleshooting

### Issue 1: No Data Returned

**Check:**

1. API URL is correct
2. Endpoint path is correct (with leading `/`)
3. API is accessible (test in browser)
4. Check WordPress error logs

**Debug:**

```php
<?php
$result = wpgetapi_endpoint('mutualist-portfolio-api', 'get-portfolios');
echo '<pre>';
print_r($result);
echo '</pre>';
?>
```

---

### Issue 2: CORS Error

**Solution:** Add WordPress domain to API's `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://yourwordpresssite.com
```

---

### Issue 3: Slow Loading

**Solutions:**

1. Increase cache time
2. Use transients for additional caching
3. Load portfolios via AJAX

---

## 📊 Complete Example: Portfolio Archive

**File:** `archive-portfolio.php`

```php
<?php get_header(); ?>

<div class="portfolio-archive">
    <div class="container">
        <h1>Portfolio</h1>

        <?php
        // Get categories for filter
        $categories = wpgetapi_endpoint('mutualist-portfolio-api', 'get-categories');

        // Get all portfolios
        $portfolios = wpgetapi_endpoint('mutualist-portfolio-api', 'get-portfolios');

        if ($categories && $portfolios) {
            ?>
            <!-- Filters -->
            <div class="filters">
                <button class="filter active" data-filter="all">All</button>
                <?php foreach ($categories as $cat): ?>
                    <button class="filter" data-filter="<?php echo esc_attr($cat); ?>">
                        <?php echo esc_html($cat); ?>
                    </button>
                <?php endforeach; ?>
            </div>

            <!-- Grid -->
            <div class="portfolio-grid">
                <?php foreach ($portfolios as $item): ?>
                    <div class="item" data-categories="<?php echo esc_attr(implode(',', $item->categories)); ?>">
                        <a href="<?php echo add_query_arg('id', $item->id, get_permalink()); ?>">
                            <img src="<?php echo esc_url($item->images[0]); ?>" alt="">
                            <h3><?php echo esc_html($item->title); ?></h3>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php
        }
        ?>
    </div>
</div>

<script>
jQuery('.filter').on('click', function() {
    var filter = jQuery(this).data('filter');
    jQuery('.filter').removeClass('active');
    jQuery(this).addClass('active');

    if (filter === 'all') {
        jQuery('.item').show();
    } else {
        jQuery('.item').hide();
        jQuery('.item').each(function() {
            var cats = jQuery(this).data('categories').split(',');
            if (cats.includes(filter)) {
                jQuery(this).show();
            }
        });
    }
});
</script>

<?php get_footer(); ?>
```

---

## 📝 Summary

**WPGetAPI Setup:**

1. ✅ Install WPGetAPI plugin
2. ✅ Add API connection (Base URL)
3. ✅ Setup 3 endpoints (portfolios, portfolio/:id, categories)
4. ✅ Use in templates with `wpgetapi_endpoint()`
5. ✅ Handle dynamic routes with query vars
6. ✅ Add caching & error handling

**URL Structure:**

- All portfolios: `/portfolio/`
- Single: `/portfolio/?id=uuid` or `/portfolio/uuid`
- With filter: `/portfolio/?category=Branding`

---

Need help with specific implementation? Let me know! 🚀
