export const executeFrames = (action: () => void, end: () => void, then: () => void, frames: number, time: number) => {
  const delay = time / frames;
  let i = 0;

  const fx = () => {
    if (i++ < frames) {
      action();
      setTimeout(fx, delay);
    } else {
      end();
    }

    then();
  };

  setTimeout(fx, delay);
};