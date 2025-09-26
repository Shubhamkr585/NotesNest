export default function Alert({ message, type = 'error' }) {
  const baseClasses = 'p-4 mb-4 text-sm rounded-lg';
  const typeClasses = {
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}!</span> {message}
    </div>
  );
}