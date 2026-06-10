import {Input, Label} from '@heroui/react';

export default function Login (){
    return(
        <>
        <div className='flex flex-col min-h-[80vh] w-full items-center justify-center p-4'>
            <div className='w-full max-w-md items-center justify-center flex flex-col gap-y-6'>
                
                <div className='text-center mb-4'>
                    <h1 className='font-bold text-2xl'>Inventory Management</h1>
                </div>

                <div className='flex w-80 flex-col gap-4'>
                    <div className='flex flex-col gap-1 text-left'>
                        <Label htmlFor='input-type-email'>Email</Label>
                        <Input id='input-type-email' placeholder='your@email.com' type='email' />
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                        <Label htmlFor='input-type-password'>Password</Label>
                        <Input id='input-type-password' placeholder='••••••••' type='password' />
                    </div>
                    
                    <div className='flex justify-end'>
                         <a href='/forgetpassword' className='text-xs text-green-600 hover:underline'>Forgot Password?</a>
                    </div>

                    <button className='w-full px-6 py-3 bg-linear-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-lg text-white font-semibold shadow-md transition-all active:scale-95'>
                        Login
                    </button>
                </div>
                
                <a href='/register' className='text-sm text-gray-600 mt-4'>
                    Don't have an account? <span className='text-green-600 font-semibold cursor-pointer hover:underline'>Register</span>
                </a>
            </div>
        </div>
        </>
    )
}