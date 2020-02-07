import 'jsdom-global/register';
import './setupEnzyme';
import './nullCompiler';
import {setupGlobalFetch} from './setupGlobalFetch';
import './setupChai';

setupGlobalFetch();
