export async function selectionSort({
  array,
  wait,
  createStatus,
  cloneStatuses,
  onStatesChange,
  onArrayChange,
}) {
  const arr = [...array];
  const states = arr.map(() => createStatus());
  onStatesChange(cloneStatuses(states));

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
    onStatesChange(cloneStatuses(states));

    for (let j = i + 1; j < arr.length; j += 1) {
      states[j].highlight = true;
      onStatesChange(cloneStatuses(states));
      await wait(2);

      if (arr[j] < arr[minIndex]) {
        states[minIndex].min = false;
        states[minIndex].highlight = false;
        minIndex = j;
        states[minIndex].min = true;
      }

      if (j !== minIndex) {
        states[j].highlight = false;
      }
      onStatesChange(cloneStatuses(states));
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      onArrayChange([...arr]);
      await wait(2);
    }

    states[i].completed = true;
    states[i].highlight = false;
    states[i].min = false;
    if (minIndex !== i) {
      states[minIndex].highlight = false;
      states[minIndex].min = false;
    }
    onStatesChange(cloneStatuses(states));
  }

  states.forEach((state) => {
    state.completed = true;
    state.highlight = false;
    state.min = false;
  });
  onStatesChange(cloneStatuses(states));

  return { status: 'sorted', array: [...arr] };
}
