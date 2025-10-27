'use client';

import { useCallback, useEffect, useState } from 'react';

const ALGORITHMS = [
  { key: 'linear-search', type: 'Search', strategy: 'Linear', label: 'Linear Search' },
  { key: 'binary-search', type: 'Search', strategy: 'Binary', label: 'Binary Search' },
  { key: 'selection-sort', type: 'Sort', strategy: 'Selection', label: 'Selection Sort' },
  { key: 'bubble-sort', type: 'Sort', strategy: 'Bubble', label: 'Bubble Sort' },
];

const SPEED_OPTIONS = [1, 2, 5, 10];
const INITIAL_DATASET_SIZE = 20;
const MIN_DATASET_SIZE = 2;
const MAX_DATASET_SIZE = 100;
const MIN_RANDOM_VALUE = 3;
const MAX_RANDOM_VALUE = 202;

const createSearchStatus = () => ({
  highlight: false,
  completed: false,
  found: false,
  searchIndex: '',
});

const createBarStatus = () => ({
  highlight: false,
  completed: false,
  min: false,
});

const cloneSearchStates = (states) => states.map((state) => ({ ...state }));
const cloneBarStates = (states) => states.map((state) => ({ ...state }));

const clampSize = (value) => {
  if (Number.isNaN(value)) {
    return MIN_DATASET_SIZE;
  }
  return Math.min(Math.max(value, MIN_DATASET_SIZE), MAX_DATASET_SIZE);
};

const generateDataset = (size, algorithm) => {
  const targetSize = clampSize(size);
  const numbers = new Set();

  while (numbers.size < targetSize) {
    const randomValue = Math.floor(
      Math.random() * (MAX_RANDOM_VALUE - MIN_RANDOM_VALUE + 1),
    ) + MIN_RANDOM_VALUE;
    numbers.add(randomValue);
  }

  const data = Array.from(numbers);

  if (algorithm.strategy === 'Binary') {
    data.sort((a, b) => a - b);
  }

  return data;
};

const formatAlgorithmClass = (algorithm) =>
  `${algorithm.strategy}_${algorithm.type}`.replace(/\s+/g, '_').toLowerCase();

export default function AlgorithmVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const [datasetSize, setDatasetSize] = useState(INITIAL_DATASET_SIZE);
  const [dataset, setDataset] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchStatuses, setSearchStatuses] = useState([]);
  const [barStatuses, setBarStatuses] = useState([]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const delay = 1000 / SPEED_OPTIONS[speedIndex];

  const wait = useCallback(
    (divider = 1) =>
      new Promise((resolve) =>
        setTimeout(resolve, Math.max(50, Math.round(delay / divider)))),
    [delay],
  );

  const regenerate = useCallback((size, algorithm) => {
    const data = generateDataset(size, algorithm);
    setDataset(data);
    setResult(null);
    if (algorithm.type === 'Search') {
      setSearchValue('');
      setSearchStatuses(data.map(() => createSearchStatus()));
      setBarStatuses([]);
    } else {
      setBarStatuses(data.map(() => createBarStatus()));
      setSearchStatuses([]);
    }
  }, []);

  useEffect(() => {
    regenerate(INITIAL_DATASET_SIZE, ALGORITHMS[0]);
  }, [regenerate]);

  const handleAlgorithmSelect = (algorithm) => {
    if (isRunning || algorithm.key === selectedAlgorithm.key) {
      setNavOpen(false);
      return;
    }
    setSelectedAlgorithm(algorithm);
    regenerate(datasetSize, algorithm);
    setNavOpen(false);
  };

  const handleGenerate = () => {
    if (isRunning) {
      return;
    }
    regenerate(datasetSize, selectedAlgorithm);
  };

  const handleSpeedToggle = () => {
    setSpeedIndex((prev) => (prev + 1) % SPEED_OPTIONS.length);
  };

  const handleDatasetSizeChange = (event) => {
    const value = clampSize(Number(event.target.value));
    setDatasetSize(value);
  };

  const handleDatasetSizeKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGenerate();
    }
  };

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const runLinearSearch = useCallback(
    async (target) => {
      const states = dataset.map(() => createSearchStatus());
      setSearchStatuses(cloneSearchStates(states));

      for (let index = 0; index < dataset.length; index += 1) {
        states.forEach((state) => {
          state.highlight = false;
        });
        states[index].highlight = true;
        setSearchStatuses(cloneSearchStates(states));
        await wait();

        if (dataset[index] === target) {
          states[index].highlight = false;
          states[index].found = true;
          setSearchStatuses(cloneSearchStates(states));
          setResult({ status: 'found', element: target, index });
          return;
        }

        states[index].highlight = false;
        states[index].completed = true;
        setSearchStatuses(cloneSearchStates(states));
      }

      setResult({ status: 'not-found', element: target });
    },
    [dataset, wait],
  );

  const runBinarySearch = useCallback(
    async (target) => {
      if (dataset.length === 0) {
        setSearchStatuses([]);
        setResult({ status: 'not-found', element: target });
        return;
      }

      const states = dataset.map(() => createSearchStatus());

      let low = 0;
      let high = dataset.length - 1;

      while (low <= high) {
        states.forEach((state, idx) => {
          state.highlight = false;
          state.searchIndex = '';
          if (idx < low || idx > high) {
            state.completed = true;
          }
        });

        const mid = Math.floor((low + high) / 2);
        states[low].searchIndex = 'low';
        states[high].searchIndex = 'high';
        states[mid].searchIndex = 'mid';
        states[mid].highlight = true;
        setSearchStatuses(cloneSearchStates(states));
        await wait();

        if (dataset[mid] === target) {
          states[mid].highlight = false;
          states[mid].found = true;
          setSearchStatuses(cloneSearchStates(states));
          setResult({ status: 'found', element: target, index: mid });
          return;
        }

        states[mid].highlight = false;
        states[mid].completed = true;

        if (dataset[mid] < target) {
          for (let idx = low; idx <= mid; idx += 1) {
            states[idx].completed = true;
          }
          low = mid + 1;
        } else {
          for (let idx = mid; idx <= high; idx += 1) {
            states[idx].completed = true;
          }
          high = mid - 1;
        }

        setSearchStatuses(cloneSearchStates(states));
        await wait();
      }

      setSearchStatuses(cloneSearchStates(states));
      setResult({ status: 'not-found', element: target });
    },
    [dataset, wait],
  );

  const runSelectionSort = useCallback(async () => {
    const arr = [...dataset];
    const states = arr.map(() => createBarStatus());
    setBarStatuses(cloneBarStates(states));

    for (let i = 0; i < arr.length; i += 1) {
      states.forEach((state) => {
        if (!state.completed) {
          state.highlight = false;
          state.min = false;
        }
      });

      let minIndex = i;
      states[i].highlight = true;
      states[i].min = true;
      setBarStatuses(cloneBarStates(states));

      for (let j = i + 1; j < arr.length; j += 1) {
        states[j].highlight = true;
        setBarStatuses(cloneBarStates(states));
        await wait(2);

        if (arr[j] < arr[minIndex]) {
          states[minIndex].min = false;
          minIndex = j;
          states[minIndex].min = true;
        }

        if (j !== minIndex) {
          states[j].highlight = false;
        }
        setBarStatuses(cloneBarStates(states));
      }

      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setDataset([...arr]);
        await wait(2);
      }

      states[i].completed = true;
      states[i].highlight = false;
      states[i].min = false;
      if (minIndex !== i) {
        states[minIndex].highlight = false;
        states[minIndex].min = false;
      }
      setBarStatuses(cloneBarStates(states));
    }

    states.forEach((state) => {
      state.completed = true;
      state.highlight = false;
      state.min = false;
    });
    setBarStatuses(cloneBarStates(states));
    setResult({ status: 'sorted' });
  }, [dataset, wait]);

  const runBubbleSort = useCallback(async () => {
    const arr = [...dataset];
    const states = arr.map(() => createBarStatus());
    setBarStatuses(cloneBarStates(states));

    for (let i = 0; i < arr.length - 1; i += 1) {
      for (let j = 0; j < arr.length - i - 1; j += 1) {
        states.forEach((state) => {
          if (!state.completed) {
            state.highlight = false;
            state.min = false;
          }
        });

        states[j].highlight = true;
        states[j + 1].highlight = true;
        setBarStatuses(cloneBarStates(states));
        await wait(2);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setDataset([...arr]);
          await wait(2);
        }
      }

      states[arr.length - i - 1].completed = true;
      states[arr.length - i - 1].highlight = false;
      setBarStatuses(cloneBarStates(states));
    }

    states.forEach((state) => {
      state.completed = true;
      state.highlight = false;
      state.min = false;
    });

    setBarStatuses(cloneBarStates(states));
    setResult({ status: 'sorted' });
  }, [dataset, wait]);

  const handleSearch = async () => {
    if (isRunning || selectedAlgorithm.type !== 'Search') {
      return;
    }

    const target = Number(searchValue);
    if (Number.isNaN(target)) {
      setResult({ status: 'invalid' });
      return;
    }

    setIsRunning(true);
    setResult({ status: 'searching', element: target });

    try {
      if (selectedAlgorithm.key === 'linear-search') {
        await runLinearSearch(target);
      } else if (selectedAlgorithm.key === 'binary-search') {
        await runBinarySearch(target);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSort = async () => {
    if (isRunning || selectedAlgorithm.type !== 'Sort' || dataset.length === 0) {
      return;
    }

    setIsRunning(true);
    setResult({ status: 'sorting' });

    try {
      if (selectedAlgorithm.key === 'selection-sort') {
        await runSelectionSort();
      } else {
        await runBubbleSort();
      }
    } finally {
      setIsRunning(false);
    }
  };

  const renderResult = () => {
    if (!result) {
      return null;
    }

    switch (result.status) {
      case 'searching':
        return <span className="statusMessage">Searching...</span>;
      case 'found':
        return (
          <span>
            The searched element{' '}
            <span className="searchedElement">{result.element}</span>{' '}
            found at index <span className="searchIndex">{result.index}</span>
          </span>
        );
      case 'not-found':
        return (
          <span>
            The searched element{' '}
            <span className="searchedElement notFound">{result.element}</span>{' '}
            not found in the array
          </span>
        );
      case 'invalid':
        return <span className="statusMessage">Please enter a valid number to search.</span>;
      case 'sorting':
        return <span className="statusMessage">Sorting...</span>;
      case 'sorted':
        return <span className="statusMessage">The data is sorted.</span>;
      default:
        return null;
    }
  };

  const algorithmClass = formatAlgorithmClass(selectedAlgorithm);
  const speedLabel = `${SPEED_OPTIONS[speedIndex]}×`;
  const isSearchMode = selectedAlgorithm.type === 'Search';
  const maxValue = dataset.length > 0 ? Math.max(...dataset) : 0;
  const barWidth = dataset.length > 0 ? Math.max(8, Math.floor(500 / dataset.length)) : 8;

  return (
    <main>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <a className="navbar-brand" href="#" onClick={(event) => event.preventDefault()}>
          Algorithm Visualizer
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setNavOpen((prev) => !prev)}
          aria-controls="navbarSupportedContent"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {ALGORITHMS.map((algorithm) => (
              <li className="nav-item" key={algorithm.key}>
                <button
                  type="button"
                  className={`nav-link btn ${
                    selectedAlgorithm.key === algorithm.key ? 'active' : ''
                  }`}
                  onClick={() => handleAlgorithmSelect(algorithm)}
                  disabled={isRunning}
                >
                  {algorithm.label}
                </button>
              </li>
            ))}
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <span id="speed" title="Speed" onClick={handleSpeedToggle}>
              {speedLabel}
            </span>
            <input
              type="number"
              name="dataset_size"
              id="dataset_size"
              placeholder="Enter Dataset"
              value={datasetSize}
              className="form-control"
              min={MIN_DATASET_SIZE}
              max={MAX_DATASET_SIZE}
              onChange={handleDatasetSizeChange}
              onKeyDown={handleDatasetSizeKeyDown}
              disabled={isRunning}
            />
            <button
              id="generate"
              className="btn btn-outline-primary my-2 my-sm-0 ml-2"
              type="button"
              onClick={handleGenerate}
              disabled={isRunning}
            >
              Generate a Random Array
            </button>
          </form>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row justify-content-md-center">
          <section className="col" id="visualizer_container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2 algorithm_name">{selectedAlgorithm.label}</h1>
            </div>
            <div className="container-fluid">
              {isSearchMode && (
                <div className="col-md-6 search_form mx-auto">
                  <div className="col">
                    <div className="input-group mb-3 mt-3">
                      <input
                        type="number"
                        className="form-control"
                        id="elToFind"
                        placeholder="Enter search element"
                        aria-label="Enter search element"
                        value={searchValue}
                        onChange={handleSearchValueChange}
                        onKeyDown={handleSearchKeyDown}
                        disabled={isRunning}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          id="search_button"
                          onClick={handleSearch}
                          disabled={isRunning || searchValue === ''}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="row result_area text-center">
                <div className="col">
                  <div id="result">{renderResult()}</div>
                </div>
              </div>
              <div className={`row visual_area ${algorithmClass}`}>
                <div className="col-md-12 text-center">
                  <div className={`bars ${isSearchMode ? 'hide' : 'animate'}`}>
                    {dataset.map((value, index) => {
                      const status = barStatuses[index] ?? createBarStatus();
                      const classes = ['bar'];
                      if (status.highlight) classes.push('highlighted');
                      if (status.completed) classes.push('completed');
                      if (status.min) classes.push('min');
                      const heightPercent = maxValue > 0 ? Math.max((value / maxValue) * 100, 1) : 1;
                      return (
                        <div
                          key={`${value}-${index}`}
                          className={classes.join(' ')}
                          data-index={index}
                          data-value={value}
                          style={{
                            '--bar-height': `${heightPercent}%`,
                            '--bar-width': `${barWidth}px`,
                            '--animation-delay': `${index * 0.05}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className={`array_wrap ${isSearchMode ? '' : 'hide'}`}>
                    {dataset.map((value, index) => {
                      const status = searchStatuses[index] ?? createSearchStatus();
                      const classes = ['array_elem'];
                      if (status.found) classes.push('found');
                      if (status.completed) classes.push('completed');
                      if (status.highlight) classes.push('highlight');
                      return (
                        <div
                          key={`${value}-${index}`}
                          className={classes.join(' ')}
                          data-index={index}
                          data-search-index={status.searchIndex ?? ''}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {!isSearchMode && (
                  <div className="col text-right">
                    <button
                      type="button"
                      id="sort"
                      className="btn btn-primary btn-sm"
                      onClick={handleSort}
                      disabled={isRunning}
                    >
                      Sort
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
