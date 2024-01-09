using NetTopologySuite.Geometries;

namespace Inzynierka
{
    public record UrbanObject(int Id)
    {
        public string Name { get; set; } = default!;
        public string Type { get; set;  } = default!;
        public Geometry Geom { get; set;  } = default!;
        public int District { get; set; } = default!;

    }
}
