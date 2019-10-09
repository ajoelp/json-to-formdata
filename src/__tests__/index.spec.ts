import objectToFormData from "../index";
import {payload,result} from "../__mocks__/stress.mock";

const formData = new FormData();

beforeEach(() => {
    formData.append = jest.fn();
});

describe('Object to form data', () => {

    describe('object', () => {

        it('will map an object', () => {
            objectToFormData({
                foo: 'bar',
                bar: 'baz'
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
            expect(formData.append).toHaveBeenCalledWith('bar', 'baz');

        });

        it('will map an nested object', () => {
            objectToFormData({
                foo: 'bar',
                bar: {
                    baz: 'foo'
                }
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
            expect(formData.append).toHaveBeenCalledWith('bar[baz]', 'foo');

        })
    });

    describe('file', () => {

        it('will append a file', () => {

            const file = new File([], '');

            objectToFormData({
                foo: file,
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', file);
        })

        it('will append a blob', () => {

            const blob = new Blob();

            objectToFormData({
                foo: blob,
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', blob);
        })
    });

    describe('null', () => {

        it('will append a null value', () => {

            objectToFormData({
                foo: null,
            }, {excludeNull: false}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', '');
        })
    });

    describe('boolean', () => {

        it('will append boolean', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: {
                    boolean: false
                }
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[boolean]', 'false');
        })
    });

    describe('array', () => {

        it('will append array', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: [
                    1,
                    2,
                    3
                ]
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[0]', 1);
            expect(formData.append).toHaveBeenCalledWith('baz[1]', 2);
            expect(formData.append).toHaveBeenCalledWith('baz[2]', 3);
        });


        it('will append array of objects', () => {

            objectToFormData({
                foo: true,
                bar: false,
                baz: [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ]
            }, {}, formData);

            expect(formData.append).toHaveBeenCalledWith('foo', 'true');
            expect(formData.append).toHaveBeenCalledWith('bar', 'false');
            expect(formData.append).toHaveBeenCalledWith('baz[0][id]', 1);
            expect(formData.append).toHaveBeenCalledWith('baz[1][id]', 2);
            expect(formData.append).toHaveBeenCalledWith('baz[2][id]', 3);
        })
    });

    describe('fields', () => {
        const file = new File([], '');
        const blob = new Blob();
        const dataProvider = [
            ['boolean', true, 'true'],
            ['!boolean', false, 'false'],
            ['string', 'test', 'test'],
            ['number', 12, '12'],
            ['file', file, file],
            ['blob', blob, file],
            ['object', {}, null],
            ['boolean', [], null],
        ];

        it.each<any[]>(dataProvider)("receives a %s (%s, %s)", (type, payload, result) => {

            const formDataObj = objectToFormData({foo: payload}, {});

            expect(formDataObj.get('foo')).toEqual(result)

        })
    });

    describe('formData', () => {

        it('will return a formData object', () => {

            const payload = {
                test: 'foo',
                bar: 'baz'
            };

            const formDataObj = objectToFormData(payload, {});

            for (const c of formDataObj.keys()) {
                expect(formDataObj.get(c)).toEqual(payload[c]);
            }

        })

    })

    describe('stress', () => {
        it('will stress test', async () => {
            const a = objectToFormData(payload, {});
            for (const data of result as any){
                const [key, value] = data;
                expect(a.get(key)).toEqual(value);
            }
        })
    });

});
