export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-purple-50 to-pink-50 border-t border-pink-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-pink-500 mb-3">Cynthia Faye</p>
          <p className="font-display text-sm tracking-[0.2em] uppercase text-purple-400 mb-6">
            The Gift &mdash; Psychic Medium & Spiritual Coach
          </p>
          <div className="divider-glam w-32 mx-auto mb-6" />
          <p className="text-purple-400 font-body text-sm">
            &copy; {new Date().getFullYear()} Cynthia Faye &mdash; The Gift. All rights reserved.
          </p>
          <p className="text-purple-300 font-body text-xs mt-2">
            Santa Rosa Beach, FL &bull; Serving the Emerald Coast
          </p>
        </div>
      </div>
    </footer>
  );
}
