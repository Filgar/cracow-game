namespace Inzynierka
{
    public static class ObjectsSelector
    {
        public static int[] GetRandomIds(IEnumerable<UrbanObject> urbanObjects, int amount, int[] forbiddenIndexes, string[] allowedTypes, int? allowedDistricts)
        {
            var filteredIds = FilterIds(urbanObjects, allowedTypes, allowedDistricts).ToList();
            var allowedIds = filteredIds
                .Where(x => !forbiddenIndexes.Contains(x));

            //In case there's less available then requested, ignore forbiddenIds and consider all objects available
            if(allowedIds.Count() < amount)
            {
                allowedIds = filteredIds;
            }
            var allowedIndexes = Enumerable.Range(0, allowedIds.Count()).ToList();

            var randomGenerator = new Random();
            return Enumerable.Range(0, Math.Min(amount, allowedIds.Count()))
                .Select(x => {
                    int index = randomGenerator.Next(1, allowedIndexes.Count()) - 1;
                    int result = allowedIndexes.ElementAt(index);
                    allowedIndexes.RemoveAt(index);
                    return allowedIds.ElementAt(result);
                    })
                .ToArray();
        }
        private static IEnumerable<int> FilterIds(IEnumerable<UrbanObject> urbanObjects, string[] allowedTypes, int? allowedDistricts)
        {
            if (allowedTypes.Length > 0)
            {
                urbanObjects = urbanObjects.Where(x => allowedTypes.Contains(x.Type));
            }

            if (allowedDistricts != null)
            {
                urbanObjects = urbanObjects.Where(x => IsInAllowedDistrict(x.District, allowedDistricts.Value));
            }

            return urbanObjects.Select(x => x.Id);
        }
        private static bool IsInAllowedDistrict(int district, int allowedDistricts) => (district & allowedDistricts) != 0;
    }

}
