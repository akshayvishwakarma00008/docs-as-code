# Custom Hooks for Every React Development

Custom hooks are reusable functions that let you add state and other React features to functional components. Here are essential custom hooks every React developer should know.

## useFetch

The useFetch hook is commonly used to fetch data from an API. It manages loading, error, and response states, encapsulating all the logic needed for data retrieval.

```javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

**Usage:**
```javascript
const { data, loading, error } = useFetch('https://api.example.com/data');
```

---

## usePrevious

usePrevious saves the previous value of a state or prop, which can be handy for animations, form data, or complex state management.

```javascript
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

**Usage:**
```javascript
const previousCount = usePrevious(count);
```

---

## useToggle

A straightforward custom hook, useToggle manages boolean states efficiently, useful for toggling themes, modals, and UI elements.

```javascript
import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);

  return [value, toggle];
}
```

**Usage:**
```javascript
const [isToggled, toggle] = useToggle();
```

---

## useLocalStorage

useLocalStorage helps in setting, getting, and updating values stored in the browser's local storage, enabling persistent data storage.

```javascript
import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
```

**Usage:**
```javascript
const [name, setName] = useLocalStorage('name', 'Guest');
```

---

## useDebounce

Debouncing prevents rapid triggering of events. useDebounce can be useful for input fields or search bars.

```javascript
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage:**
```javascript
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

---

## useInterval

useInterval manages recurring actions by setting up intervals in a way that integrates well with React's lifecycle.

```javascript
import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```

**Usage:**
```javascript
useInterval(() => {
  setCount(prevCount => prevCount + 1);
}, 1000);
```

---

## useWindowSize

useWindowSize is helpful for responsive design, allowing your component to adapt based on the viewport size.

```javascript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
```

**Usage:**
```javascript
const { width, height } = useWindowSize();
```

---

## useOnClickOutside

This hook is useful for closing modals, dropdowns, or any component that should close when clicking outside of it.

```javascript
import { useEffect } from 'react';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

**Usage:**
```javascript
const modalRef = useRef();
useOnClickOutside(modalRef, () => setIsOpen(false));
```

---

## useHover

Detecting hover over an element can be useful for tooltips, animations, or any UI feedback based on hover state.

```javascript
import { useState, useRef, useEffect } from 'react';

function useHover() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseOver = () => setHovered(true);
    const handleMouseOut = () => setHovered(false);
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
    }
    return () => {
      if (node) {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [ref]);

  return [ref, hovered];
}
```

**Usage:**
```javascript
const [hoverRef, isHovered] = useHover();
```

---

## useMediaQuery

useMediaQuery listens to CSS media queries, allowing you to apply specific styles or behaviors based on device size.

```javascript
import { useEffect, useState } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = event => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

**Usage:**
```javascript
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
```

---

## Best Practices

- Always handle cleanup in useEffect hooks
- Memoize callbacks when passing them to custom hooks
- Test custom hooks with testing libraries like `@testing-library/react-hooks`
- Document the expected parameters and return values
- Consider using TypeScript for better type safety with custom hooks
