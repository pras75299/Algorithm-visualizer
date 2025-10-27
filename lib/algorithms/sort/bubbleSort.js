export async function bubbleSort({
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

  for (let i = 0; i < arr.length - 1; i += 1) {
    let swapped = false;

    for (let j = 0; j < arr.length - i - 1; j += 1) {
      states.forEach((state) => {
        if (!state.completed) {
          state.highlight = false;
          state.min = false;
        }
      });

      states[j].highlight = true;
      states[j + 1].highlight = true;
      onStatesChange(cloneStatuses(states));
      await wait(2);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        onArrayChange([...arr]);
        await wait(2);
      }

      states[j].highlight = false;
      states[j + 1].highlight = false;
      onStatesChange(cloneStatuses(states));
    }

    states[arr.length - i - 1].completed = true;
    states[arr.length - i - 1].highlight = false;
    onStatesChange(cloneStatuses(states));

    if (!swapped) {
      break;
    }
  }

  states.forEach((state) => {
    state.completed = true;
    state.highlight = false;
    state.min = false;
  });
  onStatesChange(cloneStatuses(states));

  return { status: 'sorted', array: [...arr] };
}
