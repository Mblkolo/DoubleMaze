using System;
using System.Collections.Generic;

namespace DoubleMaze.Util
{
    public static class DictionaryExtensions
    {
        public static void Remove<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, Action<TValue> action)
        {
            TValue value;
            if (dictionary.TryGetValue(key, out value))
            {
                dictionary.Remove(key);
                action(value);
            }
        }

        public static void RemoveOrThrow<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, Action<TValue> action)
        {
            TValue value = dictionary[key];
            dictionary.Remove(key);
            action(value);
        }
    }
}
