export const createNotification = (isError, message) => {
  const div = document.querySelector('#notification');
  if (!div) return;

  div.classList.remove('hidden');

  if (isError) {
    div.innerHTML = `
      <div role="alert" class="mx-auto rounded-md border border-red-500 bg-red-50 p-4 shadow-lg max-w-md my-2">
        <div class="flex items-start gap-4">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="-mt-0.5 size-6 text-red-700 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>

          <div class="flex-1">
            <strong class="block leading-tight font-medium text-red-800"> Error </strong>
            <p class="mt-0.5 text-sm text-red-700">
              ${message}
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div role="alert" class="mx-auto rounded-md border border-green-500 bg-green-50 p-4 shadow-lg max-w-md my-2">
        <div class="flex items-start gap-4">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="-mt-0.5 size-6 text-green-700 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div class="flex-1">
            <strong class="block leading-tight font-medium text-green-800"> Success </strong>
            <p class="mt-0.5 text-sm text-green-700">
              ${message}
            </p>
          </div>
        </div>
      </div>
    `;
  }
};