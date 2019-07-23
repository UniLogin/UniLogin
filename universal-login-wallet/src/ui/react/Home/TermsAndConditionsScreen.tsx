import React from 'react';
import { useRouter } from '../../hooks';

export const TermsAndConditionsScreen = () => {
  const {history} = useRouter();

  return (
    <div className="main-bg">
      <div className="terms-box-wrapper">
        <div className="box terms-box">
          <div className="terms-box-section">
            <h1 className="terms-box-title">Terms and conditions</h1>
          </div>
          <div className="terms-description">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis perspiciatis optio placeat doloribus rem dolore, veniam saepe harum nemo officiis enim laborum tempora assumenda recusandae deserunt voluptas cum porro excepturi.</p>
            <p>Ullam odit nihil dolores blanditiis! Suscipit adipisci odit autem labore omnis voluptatibus ipsa corporis quaerat ut quos reprehenderit id, facere esse modi minima accusamus ad delectus! Odit temporibus aliquam mollitia.</p>
            <p>Magnam sapiente suscipit nihil nostrum? Non dignissimos repellat soluta commodi vitae harum eos dolorem quis aut ipsa doloremque eum facere ullam iste saepe aspernatur recusandae eveniet, consequatur illo? Facere, magnam.</p>
            <p>Exercitationem vitae consequuntur sed, placeat, earum accusantium magnam fuga perspiciatis minima unde est hic error illum animi harum veritatis quod assumenda laborum. Corrupti vero nulla itaque, velit perferendis id cupiditate!</p>
            <p>Est dolores a iste voluptas ipsum eos soluta maiores fugiat laboriosam! Ullam nobis consequuntur dolores laborum optio! Vel earum, ad neque fugiat provident nobis? Aut officia aliquam accusamus eos cum.</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis perspiciatis optio placeat doloribus rem dolore, veniam saepe harum nemo officiis enim laborum tempora assumenda recusandae deserunt voluptas cum porro excepturi.</p>
            <p>Ullam odit nihil dolores blanditiis! Suscipit adipisci odit autem labore omnis voluptatibus ipsa corporis quaerat ut quos reprehenderit id, facere esse modi minima accusamus ad delectus! Odit temporibus aliquam mollitia.</p>
            <p>Magnam sapiente suscipit nihil nostrum? Non dignissimos repellat soluta commodi vitae harum eos dolorem quis aut ipsa doloremque eum facere ullam iste saepe aspernatur recusandae eveniet, consequatur illo? Facere, magnam.</p>
            <p>Exercitationem vitae consequuntur sed, placeat, earum accusantium magnam fuga perspiciatis minima unde est hic error illum animi harum veritatis quod assumenda laborum. Corrupti vero nulla itaque, velit perferendis id cupiditate!</p>
            <p>Est dolores a iste voluptas ipsum eos soluta maiores fugiat laboriosam! Ullam nobis consequuntur dolores laborum optio! Vel earum, ad neque fugiat provident nobis? Aut officia aliquam accusamus eos cum.</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis perspiciatis optio placeat doloribus rem dolore, veniam saepe harum nemo officiis enim laborum tempora assumenda recusandae deserunt voluptas cum porro excepturi.</p>
            <p>Ullam odit nihil dolores blanditiis! Suscipit adipisci odit autem labore omnis voluptatibus ipsa corporis quaerat ut quos reprehenderit id, facere esse modi minima accusamus ad delectus! Odit temporibus aliquam mollitia.</p>
            <p>Magnam sapiente suscipit nihil nostrum? Non dignissimos repellat soluta commodi vitae harum eos dolorem quis aut ipsa doloremque eum facere ullam iste saepe aspernatur recusandae eveniet, consequatur illo? Facere, magnam.</p>
            <p>Exercitationem vitae consequuntur sed, placeat, earum accusantium magnam fuga perspiciatis minima unde est hic error illum animi harum veritatis quod assumenda laborum. Corrupti vero nulla itaque, velit perferendis id cupiditate!</p>
            <p>Est dolores a iste voluptas ipsum eos soluta maiores fugiat laboriosam! Ullam nobis consequuntur dolores laborum optio! Vel earum, ad neque fugiat provident nobis? Aut officia aliquam accusamus eos cum.</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis perspiciatis optio placeat doloribus rem dolore, veniam saepe harum nemo officiis enim laborum tempora assumenda recusandae deserunt voluptas cum porro excepturi.</p>
            <p>Ullam odit nihil dolores blanditiis! Suscipit adipisci odit autem labore omnis voluptatibus ipsa corporis quaerat ut quos reprehenderit id, facere esse modi minima accusamus ad delectus! Odit temporibus aliquam mollitia.</p>
            <p>Magnam sapiente suscipit nihil nostrum? Non dignissimos repellat soluta commodi vitae harum eos dolorem quis aut ipsa doloremque eum facere ullam iste saepe aspernatur recusandae eveniet, consequatur illo? Facere, magnam.</p>
            <p>Exercitationem vitae consequuntur sed, placeat, earum accusantium magnam fuga perspiciatis minima unde est hic error illum animi harum veritatis quod assumenda laborum. Corrupti vero nulla itaque, velit perferendis id cupiditate!</p>
            <p>Est dolores a iste voluptas ipsum eos soluta maiores fugiat laboriosam! Ullam nobis consequuntur dolores laborum optio! Vel earum, ad neque fugiat provident nobis? Aut officia aliquam accusamus eos cum.</p>
          </div>
          <div className="terms-box-section">
            <p className="terms-text">Read the full text above. When you have scrolled the bottom, click the check box below to mark that you understand and agree</p>
            <label className="checkbox">
              <input type="checkbox" />
              <div className="checkbox-text">I have read and understood the above</div>
            </label>
          </div>
          <div className="terms-box-footer">
            <button onClick={() => history.push('/welcome')} className="terms-btn terms-btn-refuse">I refuse</button>
            <button className="terms-btn terms-btn-agree">I agree</button>
          </div>
        </div>
      </div>
    </div>
  );
};
