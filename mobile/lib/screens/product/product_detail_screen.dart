import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../../config/theme.dart';
import '../../models/product.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';
import 'package:intl/intl.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;

  const ProductDetailScreen({super.key, required this.productId});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  String? _selectedSize;
  int _selectedImageIndex = 0;
  bool _showReviews = false;
  bool _showAllReviews = false;
  bool _isAddingToCart = false;

  @override
  Widget build(BuildContext context) {
    final product =
        context.watch<ProductProvider>().getProductById(widget.productId);

    if (product == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Product not found')),
      );
    }

    final relatedProducts =
        context.read<ProductProvider>().getRelatedProducts(product);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildAppBar(product),
          SliverToBoxAdapter(child: _buildImageGallery(product)),
          SliverToBoxAdapter(child: _buildProductInfo(product)),
          SliverToBoxAdapter(child: _buildSizeSelector(product)),
          SliverToBoxAdapter(child: _buildTabs(product)),
          if (relatedProducts.isNotEmpty)
            SliverToBoxAdapter(child: _buildRelated(relatedProducts)),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomSheet: _buildBottomBar(product),
    );
  }

  Widget _buildAppBar(Product product) {
    return SliverAppBar(
      floating: true,
      title: Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis),
    );
  }

  Widget _buildImageGallery(Product product) {
    if (product.images.isEmpty) {
      return Container(
        height: 350,
        color: Colors.grey[100],
        child: const Icon(Icons.image_not_supported_outlined, size: 64),
      );
    }

    return Column(
      children: [
        SizedBox(
          height: 350,
          width: double.infinity,
          child: CachedNetworkImage(
            imageUrl: product.images[_selectedImageIndex],
            fit: BoxFit.cover,
            placeholder: (c, u) =>
                const Center(child: CircularProgressIndicator(strokeWidth: 2)),
            errorWidget: (c, u, e) =>
                const Icon(Icons.image_not_supported_outlined, size: 64),
          ),
        ),
        if (product.images.length > 1)
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              height: 64,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: product.images.length,
                itemBuilder: (_, i) => GestureDetector(
                  onTap: () => setState(() => _selectedImageIndex = i),
                  child: Container(
                    width: 64,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: i == _selectedImageIndex
                            ? AppTheme.accent
                            : AppTheme.border,
                        width: i == _selectedImageIndex ? 2 : 1,
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(7),
                      child: CachedNetworkImage(
                        imageUrl: product.images[i],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildProductInfo(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            product.name,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              if (product.averageRating > 0) ...[
                Row(
                  children: List.generate(
                    5,
                    (i) => Icon(
                      i < product.averageRating.round()
                          ? Icons.star_rounded
                          : Icons.star_border_rounded,
                      size: 18,
                      color: AppTheme.star,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${product.averageRating.toStringAsFixed(1)} (${product.reviews.length} reviews)',
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '${AppTheme.currency}${product.price.toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: AppTheme.accent,
            ),
          ),
          if (product.shortDescription.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              product.shortDescription,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.textSecondary,
                height: 1.5,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSizeSelector(Product product) {
    if (product.sizes.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Select Size',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: product.sizes.map((size) {
              final isSelected = _selectedSize == size;
              return GestureDetector(
                onTap: () => setState(() => _selectedSize = size),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.primary : AppTheme.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected ? AppTheme.primary : AppTheme.border,
                    ),
                  ),
                  child: Text(
                    size,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isSelected ? Colors.white : AppTheme.textPrimary,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildTabs(Product product) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              _tabButton('Description', !_showReviews),
              const SizedBox(width: 12),
              _tabButton('Reviews (${product.reviews.length})', _showReviews),
            ],
          ),
          const SizedBox(height: 16),
          if (_showReviews)
            _buildReviewSection(product)
          else
            _buildDescription(product),
        ],
      ),
    );
  }

  Widget _tabButton(String label, bool isActive) {
    return GestureDetector(
      onTap: () => setState(() => _showReviews = label.startsWith('Reviews')),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isActive ? AppTheme.primary : AppTheme.border,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isActive ? Colors.white : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildDescription(Product product) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border, width: 0.5),
      ),
      child: Text(
        product.detailDescription.isNotEmpty
            ? product.detailDescription
            : product.shortDescription,
        style: const TextStyle(
          fontSize: 14,
          color: AppTheme.textSecondary,
          height: 1.6,
        ),
      ),
    );
  }

  Widget _buildReviewSection(Product product) {
    final reviews = _showAllReviews
        ? product.reviews
        : product.reviews.take(3).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildAddReviewButton(product),
        const SizedBox(height: 12),
        if (reviews.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.border, width: 0.5),
            ),
            child: const Column(
              children: [
                Icon(Icons.rate_review_outlined,
                    size: 40, color: AppTheme.textSecondary),
                SizedBox(height: 8),
                Text(
                  'No reviews yet',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
                Text(
                  'Be the first to review!',
                  style:
                      TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                ),
              ],
            ),
          )
        else
          ...reviews.map((r) => _reviewCard(r)),
        if (product.reviews.length > 3 && !_showAllReviews)
          TextButton(
            onPressed: () => setState(() => _showAllReviews = true),
            child: Text(
              'See all ${product.reviews.length} reviews',
              style: const TextStyle(color: AppTheme.accent),
            ),
          ),
      ],
    );
  }

  Widget _reviewCard(Review review) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.border, width: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: AppTheme.primary.withValues(alpha: 0.1),
                child: Text(
                  review.user.isNotEmpty ? review.user[0].toUpperCase() : 'A',
                  style: const TextStyle(
                    color: AppTheme.primary,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.user,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      DateFormat.yMMMd().format(review.date),
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                children: List.generate(
                  5,
                  (i) => Icon(
                    i < review.rating
                        ? Icons.star_rounded
                        : Icons.star_border_rounded,
                    size: 14,
                    color: AppTheme.star,
                  ),
                ),
              ),
            ],
          ),
          if (review.comment.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text(
              review.comment,
              style: const TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAddReviewButton(Product product) {
    final auth = context.read<AuthProvider>();
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: auth.isLoggedIn
            ? () => _showReviewDialog(product)
            : () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Please login to add a review'),
                    backgroundColor: AppTheme.warning,
                  ),
                );
              },
        icon: const Icon(Icons.edit_outlined, size: 18),
        label: const Text('Write a Review'),
      ),
    );
  }

  void _showReviewDialog(Product product) {
    final commentController = TextEditingController();
    double rating = 5;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(
            24, 24, 24, MediaQuery.of(ctx).viewInsets.bottom + 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Write a Review',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Center(
              child: RatingBar.builder(
                initialRating: 5,
                minRating: 1,
                itemSize: 36,
                itemBuilder: (c, i) =>
                    const Icon(Icons.star_rounded, color: AppTheme.star),
                onRatingUpdate: (v) => rating = v,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: commentController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Share your experience...',
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  if (commentController.text.isEmpty) return;
                  final messenger = ScaffoldMessenger.of(context);
                  final nav = Navigator.of(ctx);
                  final token = context.read<AuthProvider>().token!;
                  final productProv = context.read<ProductProvider>();
                  final err = await productProv.addReview(
                    productId: product.id,
                    comment: commentController.text,
                    rating: rating.toInt(),
                    token: token,
                  );
                  if (!ctx.mounted) return;
                  nav.pop();
                  messenger.showSnackBar(
                    SnackBar(
                      content: Text(err ?? 'Review added!'),
                      backgroundColor:
                          err != null ? AppTheme.error : AppTheme.success,
                    ),
                  );
                },
                child: const Text('Submit Review'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRelated(List<Product> related) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: Text(
            'Related Products',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
        ),
        SizedBox(
          height: 260,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: related.length,
            itemBuilder: (_, i) => Padding(
              padding: const EdgeInsets.only(right: 12),
              child: SizedBox(
                width: 170,
                child: ProductCard(product: related[i]),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomBar(Product product) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Price',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  Text(
                    '${AppTheme.currency}${product.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: _isAddingToCart ? null : () => _addToCart(product),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accent,
                  ),
                  child: _isAddingToCart
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Add to Cart'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _addToCart(Product product) async {
    if (_selectedSize == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a size'),
          backgroundColor: AppTheme.warning,
        ),
      );
      return;
    }

    setState(() => _isAddingToCart = true);
    final token = context.read<AuthProvider>().token;
    await context.read<CartProvider>().addToCart(
          product.id,
          _selectedSize!,
          token,
        );
    if (mounted) {
      setState(() => _isAddingToCart = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Added to cart!'),
          backgroundColor: AppTheme.success,
        ),
      );
    }
  }
}
