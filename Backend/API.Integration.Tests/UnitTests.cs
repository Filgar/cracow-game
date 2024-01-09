using Inzynierka;
using NetTopologySuite.Geometries;

namespace API.Unit.Tests
{
    public class UnitTests
    {
        [Fact]
        public void ReturnsExactAmountOfElements()
        {
            var mockData = this.GetMockData();
            var requestedAmount = mockData.Count() - 1;
            var result = ObjectsSelector.GetRandomIds(mockData, requestedAmount, new int[0], new string[0], null);
            Assert.Equal(requestedAmount, result.Length);
        }

        [Fact]
        public void ReturnsAllAvailableIfAmountBiggerThanAvailable()
        {
            var mockData = this.GetMockData();
            var requestedAmount = mockData.Count() + 1;
            var result = ObjectsSelector.GetRandomIds(mockData, requestedAmount, new int[0], new string[0], null);
            Assert.Equal(mockData.Count(), result.Length);
        }

        [Fact]
        public void IgnoresForbiddenIdsIfAmountBiggerThanAvailable()
        {
            var mockData = this.GetMockData().ToList();
            var requestedAmount = mockData.Count();
            var result = ObjectsSelector.GetRandomIds(mockData, requestedAmount, new int[] { mockData[0].Id, mockData[1].Id }, new string[0], null);
            Assert.Equal(mockData.Count(), result.Length);
        }

        [Fact]
        public void OmitsForbiddenIds()
        {
            var mockData = this.GetMockData().ToList();
            var forbiddenIds = new int[] { mockData[0].Id, mockData[1].Id };
            var requestedAmount = mockData.Count() - forbiddenIds.Length;
            var result = ObjectsSelector.GetRandomIds(mockData, requestedAmount, forbiddenIds, new string[0], null);

            Assert.All(result, x => Assert.DoesNotContain(x, forbiddenIds));
        }


        [Fact]
        public void OmitsForbiddenDistricts()
        {
            var mockData = this.GetMockData().ToList();
            var allowedDistricts = 6;
            var requestedAmount = mockData.Count();
            var resultIds = ObjectsSelector.GetRandomIds(mockData, requestedAmount, new int[0], new string[0], allowedDistricts);
            var result = mockData.Where(x => resultIds.Contains(x.Id));

            Assert.DoesNotContain(result, x => (x.District & allowedDistricts) == 0);
        }

        [Fact]
        public void OmitsForbiddenTypes()
        {
            var mockData = this.GetMockData().ToList();
            var allowedTypes = new string[] { "pt" };
            var requestedAmount = mockData.Count();
            var resultIds = ObjectsSelector.GetRandomIds(mockData, requestedAmount, new int[0], allowedTypes, null);
            var result = mockData.Where(x => resultIds.Contains(x.Id));

            Assert.DoesNotContain(result, x => !allowedTypes.Contains(x.Type));
        }

        private IEnumerable<UrbanObject> GetMockData()
        {
            return new List<UrbanObject>
            {
                new UrbanObject(1)
                {
                    Name = "Test1",
                    Type = "ul",
                    Geom = new Point(1, 1),
                    District = 1
                },
                new UrbanObject(2)
                {
                    Name = "Test2",
                    Type = "ul",
                    Geom = new Point(2, 2),
                    District = 2
                },
                new UrbanObject(3)
                {
                    Name = "Test3",
                    Type = "ul",
                    Geom = new Point(3, 3),
                    District = 3
                },
                new UrbanObject(4)
                {
                    Name = "Test4",
                    Type = "ul",
                    Geom = new Point(4, 4),
                    District = 4
                },
                new UrbanObject(5)
                {
                    Name = "Test5",
                    Type = "ul",
                    Geom = new Point(5, 5),
                    District = 5
                },
                new UrbanObject(6)
                {
                    Name = "Test6",
                    Type = "pt",
                    Geom = new Point(6, 6),
                    District = 6
                },
                new UrbanObject(7)
                {
                    Name = "Test7",
                    Type = "pt",
                    Geom = new Point(7, 7),
                    District = 7
                }
            };
        }
    }
}