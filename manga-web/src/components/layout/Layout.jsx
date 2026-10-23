import StarBackground from './StarBackground'

function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <main className="relative z-10 grid min-h-screen place-items-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
