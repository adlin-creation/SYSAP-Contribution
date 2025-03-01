import renderer from 'react-test-renderer';
import CreateDoctor from './CreateDoctor';
import useToken from "../../Authentication/useToken"; 

jest.mock('../../Authentication/useToken', () => ({
  __esModule: true,  
  default: jest.fn() 
}));

beforeAll(() => {
  // Mock complet de matchMedia
  global.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
  }));
});

afterAll(() => {
  global.matchMedia.mockRestore();
});

test("renders CreateDoctor form", () => {
  useToken.mockReturnValue({ token: 'fake-token' });

  const mockRefetchDoctors = jest.fn().mockReturnValue([]);
  const component = renderer.create(<CreateDoctor refetchDoctors={mockRefetchDoctors} />);
  const tree = component.toJSON();


  const hasInputWithPlaceholder = (node) => {
    if (!node || !node.children) return false;
  
    return node.children.some(child => {
      if (child.type === "input" && child.props?.placeholder === "Entrez le nom") {
        return true;
      }
      // Continue la recherche récursive sur tous les enfants
      return hasInputWithPlaceholder(child);
    });
  };
  expect(hasInputWithPlaceholder(tree)).toBe(true);
});