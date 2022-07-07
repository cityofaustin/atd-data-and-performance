export default function Flext() {
  return (
    <div className="wrapper">
      <div className="nav bg-secondary">
        <span>this is a the bootstrap nav with a fixed height</span>
      </div>
      <div className="main">
        <div className="main-row">
          <div className="sidebar">
            <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
              <span className="fs-5 fw-semibold text-white">
                List group header!
              </span>
            </a>
            <div className="sidebar-inner">
              <div className="sidebar-p">
                <p>
                  paragraph 1 paragraph 1 paragraph 1 paragraph 1 paragraph 1
                  paragraph 1 paragraph 1 paragraph 1 paragraph 1 paragraph 1
                  paragraph 1 paragraph 1 paragraph 1 paragraph 1 paragraph 1
                  paragraph 1 paragraph 1 paragraph 1 paragraph 1 paragraph 1
                </p>
              </div>
            </div>
          </div>
          <div className="map-container">
            <p>map div goes here with width 100%</p>
          </div>
        </div>
      </div>
      {/* <div className="nav bg-secondary">
        <span>optional footer....</span>
      </div> */}
    </div>
  );
}
