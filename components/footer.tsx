export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="container max-w-5xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}
