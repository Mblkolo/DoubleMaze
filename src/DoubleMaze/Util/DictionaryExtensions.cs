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
                action(value);

                dictionary.Remove(key);
            }
        }

        public static void Replace<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, TValue newValue, Action<TValue> action)
        {
            TValue oldValue;
  
            if (dictionary.TryGetValue(key, out oldValue))
                action(oldValue);

            dictionary[key] = newValue;
        }

        public static void RemoveOrThrow<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, Action<TValue> action)
        {
            TValue value = dictionary[key];
            action(value);
            dictionary.Remove(key);
        }
    }
}
