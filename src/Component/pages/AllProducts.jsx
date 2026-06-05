import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, ConfigProvider, Divider, Empty, Input, Pagination, Radio, Row, Col, Select, Slider, Spin, Space, Tag, Typography } from 'antd';
import { ClearOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import Header from './Header';
import SingleProd from './SingleProd';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice } from '../../utils/pricing';
import './style.css';

const { Text } = Typography;

const PAGE_SIZE = 12;
const DISCOUNT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
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
      const salePrice = getDiscountedPrice(product) || getMarketPrice(product);
      const priceMatch = salePrice >= priceRange[0] && salePrice <= priceRange[1];
      const discountMatch = selectedDiscount === null || getDiscountPercent(product) >= selectedDiscount;

      return searchMatch && brandMatch && priceMatch && discountMatch;
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
  }, [allProducts, priceRange, searchQuery, selectedBrands, selectedDiscount, sortBy]);

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
    (selectedDiscount === null ? 0 : 1) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (sortBy !== 'recommended' ? 1 : 0);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#111111',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }
      }}
    >
      <Header />

      <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: '56px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '22px 20px 0' }}>
          <Row gutter={[20, 20]} align="middle" style={{ marginBottom: '18px' }}>
            <Col xs={24} lg={16}>
              <Input.Search
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products, brands, styles"
                allowClear
                size="large"
                onSearch={onSearch}
                enterButton={<SearchOutlined />}
              />
            </Col>

            <Col xs={24} lg={8}>
              <Space style={{ width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Select
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: 210 }}
                  options={[
                    { value: 'recommended', label: 'Recommended' },
                    { value: 'newest', label: 'Newest' },
                    { value: 'price_low', label: 'Price: Low to High' },
                    { value: 'price_high', label: 'Price: High to Low' },
                    { value: 'name_az', label: 'Name: A to Z' }
                  ]}
                />
                <Button icon={<SortAscendingOutlined />} onClick={() => setSortBy('recommended')}>
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[24, 24]} align="top">
            <Col xs={24} lg={6} xl={5}>
              <div
                style={{
                  position: 'sticky',
                  top: '92px',
                  background: '#fff',
                  border: '1px solid #ece7df',
                  borderRadius: '22px',
                  padding: '18px',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
                }}
              >
                <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text strong style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '12px' }}>
                    Filters
                  </Text>
                  <Button type="text" icon={<ClearOutlined />} onClick={clearFilters}>
                    Clear
                  </Button>
                </Space>

                {activeFilterCount > 0 && (
                  <Tag color="default" style={{ marginTop: '10px', borderRadius: '999px', padding: '4px 10px' }}>
                    {activeFilterCount} active
                  </Tag>
                )}

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ marginBottom: '18px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '12px' }}>Brand</Text>
                  <Checkbox.Group
                    value={selectedBrands}
                    onChange={(values) => {
                      setSelectedBrands(values);
                      setCurrentPage(1);
                    }}
                    style={{ display: 'grid', gap: '10px', width: '100%' }}
                  >
                    {brandOptions.length > 0 ? (
                      brandOptions.map((brand) => (
                        <Checkbox key={brand.brand} value={brand.brand} style={{ marginInlineStart: 0 }}>
                          <Space size={8}>
                            <span>{brand.brand}</span>
                            <Tag color="default" style={{ margin: 0, borderRadius: '999px' }}>{brand.count}</Tag>
                          </Space>
                        </Checkbox>
                      ))
                    ) : (
                      <Text type="secondary">No brands found</Text>
                    )}
                  </Checkbox.Group>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ marginBottom: '18px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '12px' }}>Price</Text>
                  <Slider
                    range
                    min={0}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                    tooltip={{ formatter: (value) => `₹ ${value}` }}
                  />
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text type="secondary">₹ {formatPrice(priceRange[0])}</Text>
                    <Text type="secondary">₹ {formatPrice(priceRange[1])}</Text>
                  </Space>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '12px' }}>Discount</Text>
                  <Radio.Group
                    value={selectedDiscount}
                    onChange={(event) => {
                      setSelectedDiscount(event.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    <Radio value={null}>Any discount</Radio>
                    {DISCOUNT_OPTIONS.map((discount) => (
                      <Radio key={discount} value={discount}>
                        {discount}% and above
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={18} xl={19}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '120px 0' }}>
                  <Spin size="large" tip="Loading products..." />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '22px', padding: '80px 20px', border: '1px solid #ece7df' }}>
                  <Empty description={<span>No products matched the selected filters.</span>} />
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <Text type="secondary">{filteredProducts.length} products</Text>
                    <Text type="secondary">{searchQuery ? `Search: ${searchQuery}` : 'Browse the catalog'}</Text>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '40px'
                    }}
                  >
                    {visibleProducts.map((item) => (
                      <SingleProd key={item._id || item.id} item={item} />
                    ))}
                  </div>

                  {filteredProducts.length > PAGE_SIZE && (
                    <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center' }}>
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
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AllProducts;