import { likeArtisanProduct } from '../src/api/controllers/artisanProductController.js';
import ArtisanProduct from '../src/models/ArtisanProduct.js';

jest.mock('../src/models/ArtisanProduct.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findById: jest.fn()
  }
}));

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('likeArtisanProduct controller', () => {
  const mockProduct = () => ({
    likes: 0,
    save: jest.fn().mockResolvedValue(null)
  });

  beforeEach(() => {
    ArtisanProduct.findOne.mockReset();
    ArtisanProduct.findById.mockReset();
  });

  test('increments likes when product is found by custom id', async () => {
    const product = mockProduct();
    ArtisanProduct.findOne.mockResolvedValue(product);
    const res = createResponse();

    await likeArtisanProduct({ params: { id: 'art-1' } }, res);

    expect(product.likes).toBe(1);
    expect(product.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Artisan product liked successfully' }));
  });

  test('returns 404 when product is not found', async () => {
    ArtisanProduct.findOne.mockResolvedValue(null);
    ArtisanProduct.findById.mockResolvedValue(null);
    const res = createResponse();

    await likeArtisanProduct({ params: { id: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Artisan product not found' });
  });
});
