using NetTopologySuite.Geometries;

namespace Inzynierka.Models
{
        public record District(int Id)
        {
            public string DistrictNumber { get; set; } = default!;
            public Geometry Geom { get; set; } = default!;
            public string Name { get; set; } = default!;
            public int Value { get; set; } = default!;
        }
    }
