export async function linearSearch({
  array,
  target,
  wait,
  createStatus,
  cloneStatuses,
  onStatesChange,
}) {
  const states = array.map(() => createStatus());
  onStatesChange(cloneStatuses(states));

  for (let index = 0; index < array.length; index += 1) {
    states.forEach((state) => {
      state.highlight = false;
    });

    states[index].highlight = true;
    onStatesChange(cloneStatuses(states));
    await wait();

    if (array[index] === target) {
      states[index].highlight = false;
      states[index].found = true;
      onStatesChange(cloneStatuses(states));
      return { status: 'found', element: target, index };
    }

    states[index].highlight = false;
    states[index].completed = true;
    onStatesChange(cloneStatuses(states));
  }

  return { status: 'not-found', element: target };
}
