function SuspenseContent() {
  return (
    <div className="w-full text-2xl h-screen flex items-center justify-center text-black dark:text-dark-text bg-white dark:bg-base-100">
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );
}

export default SuspenseContent;
