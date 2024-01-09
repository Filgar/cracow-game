namespace Inzynierka
{
    public class GetUrbanObjectsRequest
    {
        public int[] ForbiddenIds { get; set; } = default!;
        public string[] AllowedTypes { get; set; } = default!;
        public int? AllowedDistricts { get; set; } = default!;
        public int Amount { get; set; } = default!;
    }




}
