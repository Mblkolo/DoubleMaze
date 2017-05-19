using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace DoubleMaze.Util
{
    public class WithoutWallStringEnumConverter : StringEnumConverter
    {
        public override bool CanConvert(Type objectType)
        {
            if (objectType == typeof(Game.Wall))
                return false;

            return base.CanConvert(objectType);
        }
    }
}
