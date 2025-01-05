import React from 'react';
import { Card, Form, FormControl } from 'react-bootstrap';

const Filters = ({
  brandsList,
  selectedBrands,
  setSelectedBrands,
  availableModels,
  selectedModels,
  setSelectedModels,
  sortOrder,
  setSortOrder,
  brandSearch,
  setBrandSearch,
  modelSearch,
  setModelSearch,
}) => {

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleModelChange = (model) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleSortChange = (event) => setSortOrder(event.target.value);

  const normalizeString = (str) => (str ? str.replace(/\s+/g, "").toLowerCase() : "");

  return (
    <div>
      <h6>Sort By</h6>
      <Card className="shadow px-1 py-1">
        <Card.Body>
          <Form>
            <Form.Check
              type="radio"
              label="Old to new"
              value="oldToNew"
              name="sort"
              checked={sortOrder === 'oldToNew'}
              onChange={handleSortChange}
            />
            <Form.Check
              type="radio"
              label="New to old"
              value="newToOld"
              name="sort"
              checked={sortOrder === 'newToOld'}
              onChange={handleSortChange}
            />
            <Form.Check
              type="radio"
              label="Price high to low"
              value="priceHighToLow"
              name="sort"
              checked={sortOrder === 'priceHighToLow'}
              onChange={handleSortChange}
            />
            <Form.Check
              type="radio"
              label="Price low to high"
              value="priceLowToHigh"
              name="sort"
              checked={sortOrder === 'priceLowToHigh'}
              onChange={handleSortChange}
            />
          </Form>
        </Card.Body>
      </Card>

      <h6 className="mt-4">Brands</h6>
      <Card className="shadow px-1 py-1">
        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Form>
            <div className="input-group mb-2">
              <span className="input-group-text">
                <img src="/searchIcon.svg" alt="Search Icon" width={14} />
              </span>
              <FormControl
                type="search"
                placeholder="Search"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            {brandsList
              .filter((brand) =>
                brandSearch.trim() === "" || normalizeString(brand).includes(normalizeString(brandSearch))
              )
              .map((brand) => (
                <Form.Check
                  key={brand}
                  type="checkbox"
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
              ))}
          </Form>
        </Card.Body>
      </Card>

      <h6 className="mt-4">Model</h6>
      <Card className="shadow px-1 py-1">
        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Form>
            <div className="input-group mb-2">
              <span className="input-group-text">
                <img src="/searchIcon.svg" alt="Search Icon" width={14} />
              </span>
              <FormControl
                type="search"
                placeholder="Search"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
              />
            </div>

            {availableModels.length === 0 ? (
              <p>No model available.</p>
            ) : (
              <>
                {availableModels
                  .filter((model) =>
                    modelSearch.trim() === "" || normalizeString(model).includes(normalizeString(modelSearch))
                  )
                  .map((model) => (
                    <Form.Check
                      key={model}
                      type="checkbox"
                      label={model}
                      checked={selectedModels.includes(model)}
                      onChange={() => handleModelChange(model)}
                    />
                  ))}
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Filters;
