import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, ConfigProvider, Divider, Empty, Input, Pagination, Radio, Row, Col, Select, Slider, Spin, Space, Tag, Typography } from 'antd';
import { CaretDownOutlined, ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SingleProd from './SingleProd';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice } from '../../utils/pricing';
import './style.css';

const { Text } = Typography;

const PAGE_SIZE = 12;
const DISCOUNT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const AllProducts = () => {
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const url = process.env.REACT_APP_BACKENDURL;
        const response = await fetch(`${url}/productapi/fetchproducts?all=1`);

        if (!response.ok) {
          setAllProducts([]);
          return;
        }

        const data = await response.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error(error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const initialQuery = String(location.state?.query || '').trim();

    if (initialQuery) {
      setSearchInput(initialQuery);
      setSearchQuery(initialQuery);
      setCurrentPage(1);
    }
  }, [location.state]);

  const brandOptions = useMemo(() => {
    const counts = new Map();

    allProducts.forEach((product) => {
      const brand = String(product.company || '').trim();
      if (!brand) {
        return;
      }

      counts.set(brand, (counts.get(brand) || 0) + 1);
    });

    return [...counts.entries()]
      .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
      .map(([brand, count]) => ({ brand, count }));
  }, [allProducts]);

  const categoryOptions = useMemo(() => {
    const counts = new Map();

    allProducts.forEach((product) => {
      const category = String(product.category || 'Others').trim() || 'Others';
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    return [...counts.entries()]
      .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
      .map(([category, count]) => ({ category, count }));
  }, [allProducts]);

  const maxPrice = useMemo(() => {
    const prices = allProducts.map((product) => getDiscountedPrice(product) || getMarketPrice(product)).filter(Boolean);
    const highest = prices.length > 0 ? Math.max(...prices) : 10000;
    return highest > 0 ? highest : 10000;
  }, [allProducts]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);

    const filtered = allProducts.filter((product) => {
      const searchMatch =
        !query ||
        [product.name, product.company, product.category]
          .map(normalizeText)
          .some((field) => field.includes(query));

      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.company);
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(String(product.category || 'Others').trim() || 'Others');
      const salePrice = getDiscountedPrice(product) || getMarketPrice(product);
      const priceMatch = salePrice >= priceRange[0] && salePrice <= priceRange[1];
      const discountMatch = selectedDiscount === null || getDiscountPercent(product) >= selectedDiscount;

      return searchMatch && brandMatch && categoryMatch && priceMatch && discountMatch;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case 'newest':
        sorted.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
        break;
      case 'price_low':
        sorted.sort((left, right) => (getDiscountedPrice(left) || getMarketPrice(left)) - (getDiscountedPrice(right) || getMarketPrice(right)));
        break;
      case 'price_high':
        sorted.sort((left, right) => (getDiscountedPrice(right) || getMarketPrice(right)) - (getDiscountedPrice(left) || getMarketPrice(left)));
        break;
      case 'name_az':
        sorted.sort((left, right) => normalizeText(left.name).localeCompare(normalizeText(right.name)));
        break;
      default:
        break;
    }

    return sorted;
  }, [allProducts, priceRange, searchQuery, selectedBrands, selectedCategories, selectedDiscount, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedDiscount(null);
    setPriceRange([0, maxPrice]);
    setSortBy('recommended');
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const onSearch = (value) => {
    setSearchInput(value);
    setSearchQuery(value.trim());
    setCurrentPage(1);
  };

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    (selectedDiscount === null ? 0 : 1) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (sortBy !== 'recommended' ? 1 : 0);

  const resultLabel = searchQuery ? `Search results for “${searchQuery}”` : 'All Products';
  const catalogStats = [
    { label: 'Products', value: allProducts.length },
    { label: 'Brands', value: brandOptions.length },
    { label: 'Visible', value: filteredProducts.length }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#111111',
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }
      }}
    >
      <Header />

      <div className="store-page">
        <div className="store-page__inner">
          <div className="store-breadcrumbs">Home / Store / {resultLabel}</div>

          <section className="store-hero">
            <div className="store-hero__copy">
              <span className="store-hero__eyebrow">Curated catalog</span>
              <h1>{resultLabel}</h1>
              <p>
                Explore a cleaner, faster catalog with richer filters, sharper price sorting, and a more intentional shopping flow.
              </p>

              <div className="store-hero__stats">
                {catalogStats.map((stat) => (
                  <div key={stat.label} className="store-stat-card">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="store-hero__panel">
              <div className="store-hero__panel-label">Quick search</div>
              <Input.Search
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products, brands and more"
                allowClear
                size="large"
                onSearch={onSearch}
                enterButton={<SearchOutlined />}
              />

              <div className="store-hero__panel-note">
                Use filters to narrow the collection or jump straight into a search term.
              </div>
            </div>
          </section>

          <div className="store-title-row">
            <div>
              <h1>{resultLabel}</h1>
              <p>{filteredProducts.length} items ready to browse</p>
            </div>
          </div>

          <div className="store-toolbar">
            <div className="store-toolbar__left">
              <span className="store-toolbar__label">FILTERS</span>
              <div className="store-toolbar__chips">
                <span className="store-chip">Brands <CaretDownOutlined /></span>
                <span className="store-chip">Price <CaretDownOutlined /></span>
                <span className="store-chip">Discount <CaretDownOutlined /></span>
              </div>
            </div>

            <Select
              value={sortBy}
              onChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
              className="store-sort"
              options={[
                { value: 'recommended', label: 'Sort by: Recommended' },
                { value: 'newest', label: 'Newest' },
                { value: 'price_low', label: 'Price: Low to High' },
                { value: 'price_high', label: 'Price: High to Low' },
                { value: 'name_az', label: 'Name: A to Z' }
              ]}
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="store-active-filters">
              <div className="store-active-filters__label">Active filters</div>
              <Space size={[8, 10]} wrap>
                {searchQuery && <Tag className="store-active-filters__tag">Search: {searchQuery}</Tag>}
                {selectedBrands.map((brand) => <Tag key={brand} className="store-active-filters__tag">{brand}</Tag>)}
                {selectedCategories.map((category) => <Tag key={category} className="store-active-filters__tag">{category}</Tag>)}
                {selectedDiscount !== null && <Tag className="store-active-filters__tag">{selectedDiscount}% and above</Tag>}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && <Tag className="store-active-filters__tag">₹ {formatPrice(priceRange[0])} - ₹ {formatPrice(priceRange[1])}</Tag>}
                {sortBy !== 'recommended' && <Tag className="store-active-filters__tag">Sort: {sortBy.replace('_', ' ')}</Tag>}
              </Space>
              <Button type="text" icon={<ClearOutlined />} onClick={clearFilters} className="store-active-filters__clear">
                Reset
              </Button>
            </div>
          )}

          <Row gutter={0} className="store-layout">
            <Col xs={24} lg={5} xl={4}>
              <aside className="store-sidebar">
                <div className="store-sidebar__header">
                  <span>Refine</span>
                  <strong>{filteredProducts.length} results</strong>
                </div>

                <div className="store-filter-group">
                  <div className="store-filter-title">CATEGORIES</div>
                  <Checkbox.Group
                    value={selectedCategories}
                    onChange={(values) => {
                      setSelectedCategories(values);
                      setCurrentPage(1);
                    }}
                    className="store-filter-list"
                  >
                    {categoryOptions.length > 0 ? categoryOptions.map((category) => (
                      <Checkbox key={category.category} value={category.category} className="store-filter-item">
                        {category.category} <span>({category.count})</span>
                      </Checkbox>
                    )) : <div className="store-filter-empty">No categories</div>}
                  </Checkbox.Group>
                </div>

                <Divider />

                <div className="store-filter-group">
                  <div className="store-filter-title">BRAND</div>
                  <Checkbox.Group
                    value={selectedBrands}
                    onChange={(values) => {
                      setSelectedBrands(values);
                      setCurrentPage(1);
                    }}
                    className="store-filter-list store-filter-list--brand"
                  >
                    {brandOptions.length > 0 ? brandOptions.map((brand) => (
                      <Checkbox key={brand.brand} value={brand.brand} className="store-filter-item">
                        {brand.brand} <span>({brand.count})</span>
                      </Checkbox>
                    )) : <div className="store-filter-empty">No brands</div>}
                  </Checkbox.Group>
                </div>

                <Divider />

                <div className="store-filter-group">
                  <div className="store-filter-title">PRICE</div>
                  <Slider
                    range
                    min={0}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                    tooltip={{ formatter: (value) => `₹ ${value}` }}
                    className="store-slider"
                  />
                  <div className="store-price-row">
                    <span>₹ {formatPrice(priceRange[0])}</span>
                    <span>₹ {formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                <Divider />

                <div className="store-filter-group">
                  <div className="store-filter-title">DISCOUNT</div>
                  <Radio.Group
                    value={selectedDiscount}
                    onChange={(event) => {
                      setSelectedDiscount(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="store-radio-list"
                  >
                    <Radio value={null}>Any discount</Radio>
                    {DISCOUNT_OPTIONS.map((discount) => (
                      <Radio key={discount} value={discount}>{discount}% and above</Radio>
                    ))}
                  </Radio.Group>
                </div>

                <Button type="text" className="store-clear-btn" icon={<ClearOutlined />} onClick={clearFilters}>
                  Clear all
                </Button>
              </aside>
            </Col>

            <Col xs={24} lg={19} xl={20}>
              <section className="store-results">
                <div className="store-results__meta">
                  <span>{filteredProducts.length} products</span>
                  <span>{activeFilterCount > 0 ? `${activeFilterCount} filters active` : 'Browse the catalog'}</span>
                </div>

                {loading ? (
                  <div className="store-state">
                    <Spin size="large" tip="Loading products..." />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="store-state">
                    <Empty description={<span>No products matched the selected filters.</span>} />
                  </div>
                ) : (
                  <>
                    <div className="store-grid">
                      {visibleProducts.map((item) => (
                        <SingleProd key={item._id || item.id} item={item} />
                      ))}
                    </div>

                    {filteredProducts.length > PAGE_SIZE && (
                      <div className="store-pagination">
                        <Pagination
                          current={currentPage}
                          total={filteredProducts.length}
                          pageSize={PAGE_SIZE}
                          showSizeChanger={false}
                          onChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </section>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AllProducts;