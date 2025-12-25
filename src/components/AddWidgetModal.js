// "use client";

// import { useState } from "react";

// export default function AddWidgetModal({ onClose , onAdd  }) {
//   const [apiTested, setApiTested] = useState(false);

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 z-40
//                    bg-black/40 dark:bg-black/60
//                    backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//         <div
//           className="w-full max-w-lg rounded-xl shadow-xl
//                      bg-white dark:bg-slate-900
//                      text-slate-900 dark:text-white"
//         >
//           {/* Header */}
//           <div
//             className="flex items-center justify-between px-6 py-4
//                        border-b border-slate-200 dark:border-slate-700"
//           >
//             <h2 className="text-lg font-semibold">Add New Widget</h2>
//             <button
//               onClick={onClose}
//               className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Body */}
//           <div className="px-6 py-5 space-y-4">
//             {/* Widget Name */}
//             <div>
//               <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
//                 Widget Name
//               </label>
//               <input
//                 placeholder="e.g. Bitcoin Price Tracker"
//                 className="w-full rounded-md px-3 py-2 text-sm outline-none
//                            bg-slate-100 dark:bg-slate-800
//                            border border-slate-300 dark:border-slate-700
//                            focus:border-emerald-500"
//               />
//             </div>

//             {/* API URL */}
//             <div>
//               <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
//                 API URL
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   placeholder="https://api.example.com/data"
//                   className="flex-1 rounded-md px-3 py-2 text-sm outline-none
//                              bg-slate-100 dark:bg-slate-800
//                              border border-slate-300 dark:border-slate-700
//                              focus:border-emerald-500"
//                 />
//                 <button
//                   onClick={() => setApiTested(true)}
//                   className="px-4 py-2 rounded-md text-sm
//                              bg-emerald-600 text-white
//                              hover:bg-emerald-700"
//                 >
//                   Test
//                 </button>
//               </div>
//             </div>

//             {/* Success Message */}
//             {apiTested && (
//               <div
//                 className="rounded-md px-4 py-2 text-sm
//                            bg-emerald-100 dark:bg-emerald-900/40
//                            border border-emerald-300 dark:border-emerald-700
//                            text-emerald-700 dark:text-emerald-300"
//               >
//                 API connection successful! 1 top-level fields found.
//               </div>
//             )}

//             {/* Expanded Section */}
//             {apiTested && (
//               <>
//                 {/* Refresh Interval */}
//                 <div>
//                   <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
//                     Refresh Interval (seconds)
//                   </label>
//                   <input
//                     defaultValue="30"
//                     className="w-full rounded-md px-3 py-2 text-sm
//                                bg-slate-100 dark:bg-slate-800
//                                border border-slate-300 dark:border-slate-700"
//                   />
//                 </div>

//                 {/* Display Mode */}
//                 <div>
//                   <label className="block text-sm mb-2 text-slate-500 dark:text-slate-400">
//                     Display Mode
//                   </label>
//                   <div className="flex gap-2">
//                     <button className="px-3 py-1 rounded-md text-sm bg-emerald-600 text-white">
//                       Card
//                     </button>
//                     <button className="px-3 py-1 rounded-md text-sm
//                                        bg-slate-200 dark:bg-slate-800">
//                       Table
//                     </button>
//                     <button className="px-3 py-1 rounded-md text-sm
//                                        bg-slate-200 dark:bg-slate-800">
//                       Chart
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div
//             className="flex justify-end gap-3 px-6 py-4
//                        border-t border-slate-200 dark:border-slate-700"
//           >
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 onAdd();
//                 onClose();
//               }}
//               className="px-4 py-2 rounded-md text-sm
//                          bg-emerald-600 text-white hover:bg-emerald-700"
//             >
//               Add Widget
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }















"use client";

import { useState } from "react";

export default function AddWidgetModal({ onClose, onAdd }) {
  const [apiTested, setApiTested] = useState(false);
  const [displayMode, setDisplayMode] = useState("card");

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold">Add New Widget</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            
            {/* Widget Name */}
            <div>
              <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
                Widget Name
              </label>
              <input
                placeholder="e.g. Bitcoin Price Tracker"
                className="w-full rounded-md px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
              />
            </div>

            {/* API URL */}
            <div>
              <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
                API URL
              </label>
              <div className="flex gap-2">
                <input
                  placeholder="https://api.example.com/data"
                  className="flex-1 rounded-md px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
                <button
                  onClick={() => setApiTested(true)}
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                >
                  Test
                </button>
              </div>
            </div>

            {/* Success Message */}
            {apiTested && (
              <div className="rounded-md px-4 py-2 text-sm bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                API connection successful! 1 top-level fields found.
              </div>
            )}

            {/* Refresh Interval */}
            {apiTested && (
              <div>
                <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
                  Refresh Interval (seconds)
                </label>
                <input
                  defaultValue="30"
                  className="w-full rounded-md px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            )}

            {/* Display Mode */}
            {apiTested && (
              <div>
                <label className="block text-sm mb-2 text-slate-500 dark:text-slate-400">
                  Display Mode
                </label>
                <div className="flex gap-2">
                  {["card", "table", "chart"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDisplayMode(mode)}
                      className={`px-4 py-1.5 rounded-md text-sm capitalize
                        ${
                          displayMode === mode
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAdd(displayMode);
                onClose();
              }}
              className="px-4 py-2 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Add Widget
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
