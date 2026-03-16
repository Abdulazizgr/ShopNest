import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/product.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';

class CollectionScreen extends StatefulWidget {
  const CollectionScreen({super.key});

  @override
  State<CollectionScreen> createState() => _CollectionScreenState();
}

class _CollectionScreenState extends State<CollectionScreen> {
  final List<String> _selectedCategories = [];
  final List<String> _selectedSubCategories = [];
  String _sortType = 'relevant';
  bool _showFilters = false;

  static const categories = ['Men', 'Women', 'Kids'];
  static const subCategories = [
    'T-Shirts & Shirts',
    'Hoodies & Sweatshirts',
    'Jackets & Coats',
    'Pants & Jeans',
    'Shorts',
    'Dresses & Skirts',
  ];

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();
    final filteredProducts = productProvider.getFilteredProducts(
      categories: _selectedCategories,
      subCategories: _selectedSubCategories,
      sortType: _sortType,
    );

    return Column(
      children: [
        if (productProvider.showSearch) _buildSearchBar(productProvider),
        _buildToolbar(filteredProducts.length),
        if (_showFilters) _buildFilters(),
        Expanded(
          child: filteredProducts.isEmpty
              ? _buildEmpty()
              : _buildGrid(filteredProducts),
        ),
      ],
    );
  }

  Widget _buildSearchBar(ProductProvider provider) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      color: AppTheme.surface,
      child: TextField(
        autofocus: true,
        onChanged: provider.setSearchQuery,
        decoration: InputDecoration(
          hintText: 'Search products...',
          prefixIcon: const Icon(Icons.search, size: 20),
          suffixIcon: IconButton(
            icon: const Icon(Icons.close, size: 20),
            onPressed: provider.closeSearch,
          ),
          filled: true,
          fillColor: AppTheme.background,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }

  Widget _buildToolbar(int count) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Text(
            '$count products',
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 13,
            ),
          ),
          const Spacer(),
          GestureDetector(
            onTap: () => setState(() => _showFilters = !_showFilters),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _showFilters ? AppTheme.primary : AppTheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.border),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.tune_rounded,
                    size: 16,
                    color: _showFilters ? Colors.white : AppTheme.textPrimary,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Filters',
                    style: TextStyle(
                      fontSize: 13,
                      color:
                          _showFilters ? Colors.white : AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _sortType,
                isDense: true,
                style: const TextStyle(
                    fontSize: 13, color: AppTheme.textPrimary),
                items: const [
                  DropdownMenuItem(
                      value: 'relevant', child: Text('Relevant')),
                  DropdownMenuItem(
                      value: 'low-high', child: Text('Price: Low to High')),
                  DropdownMenuItem(
                      value: 'high-low', child: Text('Price: High to Low')),
                ],
                onChanged: (v) => setState(() => _sortType = v!),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Categories',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: categories.map((c) => _filterChip(c, _selectedCategories)).toList(),
          ),
          const SizedBox(height: 16),
          const Text(
            'Type',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: subCategories
                .map((s) => _filterChip(s, _selectedSubCategories))
                .toList(),
          ),
          const SizedBox(height: 12),
          if (_selectedCategories.isNotEmpty ||
              _selectedSubCategories.isNotEmpty)
            TextButton.icon(
              onPressed: () => setState(() {
                _selectedCategories.clear();
                _selectedSubCategories.clear();
              }),
              icon: const Icon(Icons.clear_all, size: 18),
              label: const Text('Clear All'),
              style: TextButton.styleFrom(foregroundColor: AppTheme.accent),
            ),
        ],
      ),
    );
  }

  Widget _filterChip(String label, List<String> selected) {
    final isSelected = selected.contains(label);
    return GestureDetector(
      onTap: () => setState(() {
        isSelected ? selected.remove(label) : selected.add(label);
      }),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary : AppTheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppTheme.primary : AppTheme.border,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isSelected ? Colors.white : AppTheme.textPrimary,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }

  Widget _buildGrid(List<Product> products) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.65,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: products.length,
      itemBuilder: (_, i) => ProductCard(product: products[i]),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_rounded, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text(
            'No products found',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Try adjusting your filters or search',
            style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
          ),
        ],
      ),
    );
  }
}
