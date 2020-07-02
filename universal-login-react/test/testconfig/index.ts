import 'jsdom-global/register';
import './setupEnzyme';
import './nullCompiler';
import './setupChai';
import {setupGlobalFetch} from './setupGlobalFetch';

setupGlobalFetch();
