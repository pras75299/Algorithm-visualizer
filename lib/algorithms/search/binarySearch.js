export async function binarySearch({
  array,
  target,
  wait,
  createStatus,
  cloneStatuses,
  onStatesChange,
}) {
  if (array.length === 0) {
    onStatesChange([]);
    return { status: 'not-found', element: target };
  }

  const states = array.map(() => createStatus());
  let low = 0;
  let high = array.length - 1;

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
    onStatesChange(cloneStatuses(states));
    await wait();

    if (array[mid] === target) {
      states[mid].highlight = false;
      states[mid].found = true;
      onStatesChange(cloneStatuses(states));
      return { status: 'found', element: target, index: mid };
    }

    states[mid].highlight = false;
    states[mid].completed = true;

    if (array[mid] < target) {
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

    onStatesChange(cloneStatuses(states));
    await wait();
  }

  onStatesChange(cloneStatuses(states));
  return { status: 'not-found', element: target };
}
