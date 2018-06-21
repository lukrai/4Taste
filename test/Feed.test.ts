import * as chai from 'chai';
import * as mocha from 'mocha';
import { HelloWorld } from '../src/HelloWorld';

import chaiHttp = require('chai-http');
import app from '../src/App';
import { IFeed } from '../src/models/Feed.model';

var expect = chai.expect;
chai.use(chaiHttp);

const feedTemplate = {
    name: "Test Feed",
    sources: [{ profileName: "carthrottle",  provider: "facebook"}, { profileName: "carthrottle2",  provider: "facebook"}],
    date_created: Date.now(),
};

describe('Feed Routes', () => {

    let feedId: String = null;

    it('should be json', () => {
        return chai.request(app).get('/')
            .then(res => {
                expect(res.type).to.eql('application/json');
            });
    });

    it('Add Feed', () => {
        return chai.request(app).post('/api/feed/new')
            .send(feedTemplate)
            .then(res => {
                expect(res.body.message).to.eql("Successfully added!");
                feedId = res.body.id;
            });
    });

    it('Get Feed', () => {
        return chai.request(app).get(`/api/feed/${feedId}`)
            .then(res => {
                console.log(res.body);
                chai.assert.deepNestedInclude(feedTemplate, res.body, "Get Feed");
            });
    });
});