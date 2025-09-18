import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RedditReviewsPage from './pages/RedditReviewsPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={RedditReviewsPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;